import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../db/database.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CropEnrollmentsService {
  constructor(private databaseService: DatabaseService) {}

  async createEnrollment(data: any): Promise<any> {
    const id = uuidv4();
    await this.databaseService.execute(
      `INSERT INTO crop_enrollments (id, farmer_id, farm_id, program_id, crop_id, variety_id, season, sowing_date, expected_harvest_date, area_enrolled, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'), datetime('now'))`,
      [id, data.farmer_id, data.farm_id, data.program_id, data.crop_id, data.variety_id, data.season, data.sowing_date, data.expected_harvest_date, data.area_enrolled]
    );
    return { id, ...data };
  }

  async getEnrollments(farmerId?: string, farmId?: string): Promise<any[]> {
    let query = `SELECT * FROM crop_enrollments WHERE 1=1`;
    const params: any[] = [];
    if (farmerId) { query += ` AND farmer_id = ?`; params.push(farmerId); }
    if (farmId) { query += ` AND farm_id = ?`; params.push(farmId); }
    query += ` ORDER BY created_at DESC`;
    return this.databaseService.query(query, params);
  }
}

@Injectable()
export class SurveysService {
  constructor(private databaseService: DatabaseService) {}

  async createSurvey(data: any): Promise<any> {
    const id = uuidv4();
    await this.databaseService.execute(
      `INSERT INTO survey_templates (id, program_id, crop_id, stage_id, name, description, status, form_schema_json, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'draft', ?, ?, datetime('now'), datetime('now'))`,
      [id, data.program_id, data.crop_id, data.stage_id, data.name, data.description, JSON.stringify(data.form_schema || {}), data.created_by]
    );
    return { id, ...data };
  }

  async getSurveys(programId?: string, cropId?: string): Promise<any[]> {
    let query = `SELECT * FROM survey_templates WHERE status != 'draft'`;
    const params: any[] = [];
    if (programId) { query += ` AND program_id = ?`; params.push(programId); }
    if (cropId) { query += ` AND crop_id = ?`; params.push(cropId); }
    return this.databaseService.query(query, params);
  }

  async getSurveyInstances(agentId: string, status?: string): Promise<any[]> {
    let query = `SELECT si.*, st.name as survey_name FROM survey_instances si INNER JOIN survey_templates st ON si.survey_id = st.id WHERE si.assigned_agent_id = ?`;
    const params: any[] = [agentId];
    if (status) { query += ` AND si.status = ?`; params.push(status); }
    return this.databaseService.query(query, params);
  }

  async submitSurveyResponse(data: any): Promise<any> {
    const id = uuidv4();
    await this.databaseService.execute(
      `INSERT INTO survey_responses (id, instance_id, response_json, media_refs_json, gps_json, submitted_by, device_timestamp, sync_status, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'submitted', datetime('now'))`,
      [id, data.instance_id, JSON.stringify(data.response), JSON.stringify(data.media_refs || []), JSON.stringify(data.gps || {}), data.submitted_by, data.device_timestamp]
    );
    await this.databaseService.execute(
      `UPDATE survey_instances SET status = 'submitted', updated_at = datetime('now') WHERE id = ?`,
      [data.instance_id]
    );
    return { id, ...data };
  }
}

@Injectable()
export class InputsService {
  constructor(private databaseService: DatabaseService) {}

  async createInput(data: any): Promise<any> {
    const id = uuidv4();
    await this.databaseService.execute(
      `INSERT INTO input_records (id, crop_enrollment_id, input_type, product, nutrient_type, quantity, unit, date, cost, method, photo_refs_json, gps_json, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [id, data.crop_enrollment_id, data.input_type, data.product, data.nutrient_type, data.quantity, data.unit, data.date, data.cost, data.method, JSON.stringify(data.photos || []), JSON.stringify(data.gps || {}), data.created_by]
    );
    return { id, ...data };
  }

  async getInputs(cropEnrollmentId: string): Promise<any[]> {
    return this.databaseService.query(
      `SELECT * FROM input_records WHERE crop_enrollment_id = ? ORDER BY date DESC`,
      [cropEnrollmentId]
    );
  }
}

@Injectable()
export class SamplingService {
  constructor(private databaseService: DatabaseService) {}

  async createSample(data: any): Promise<any> {
    const id = uuidv4();
    const sampleCode = `SMP-${Date.now()}`;
    await this.databaseService.execute(
      `INSERT INTO samples (id, crop_enrollment_id, sample_type, sample_code, date, gps_json, photo_refs_json, status, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, datetime('now'))`,
      [id, data.crop_enrollment_id, data.sample_type, sampleCode, data.date, JSON.stringify(data.gps || {}), JSON.stringify(data.photos || []), data.created_by]
    );
    return { id, sampleCode, ...data };
  }
}

@Injectable()
export class HarvestsService {
  constructor(private databaseService: DatabaseService) {}

  async createHarvest(data: any): Promise<any> {
    const id = uuidv4();
    await this.databaseService.execute(
      `INSERT INTO harvests (id, crop_enrollment_id, harvest_date, quantity, unit, quality_json, photo_refs_json, gps_json, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [id, data.crop_enrollment_id, data.harvest_date, data.quantity, data.unit, JSON.stringify(data.quality || {}), JSON.stringify(data.photos || []), JSON.stringify(data.gps || {}), data.created_by]
    );
    return { id, ...data };
  }
}

@Injectable()
export class ProcurementsService {
  constructor(private databaseService: DatabaseService) {}

  async createProcurement(data: any): Promise<any> {
    const id = uuidv4();
    const netQty = data.gross_qty - (data.gross_qty * (data.moisture_percent || 0) / 100) - (data.gross_qty * (data.admixture_percent || 0) / 100);
    const amount = netQty * data.rate;
    await this.databaseService.execute(
      `INSERT INTO procurements (id, farmer_id, crop_enrollment_id, center_id, gross_qty, moisture_percent, admixture_percent, net_qty, grade, rate, amount, payment_mode, payment_status, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, datetime('now'))`,
      [id, data.farmer_id, data.crop_enrollment_id, data.center_id, data.gross_qty, data.moisture_percent, data.admixture_percent, netQty, data.grade, data.rate, amount, data.payment_mode, data.created_by]
    );
    return { id, net_qty: netQty, amount, ...data };
  }

  async createLot(data: any): Promise<any> {
    const id = uuidv4();
    const lotNumber = `LOT-${Date.now()}`;
    await this.databaseService.execute(
      `INSERT INTO lots (id, lot_number, program_id, crop_id, center_id, total_qty, grade, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'created', datetime('now'), datetime('now'))`,
      [id, lotNumber, data.program_id, data.crop_id, data.center_id, data.total_qty, data.grade]
    );
    return { id, lot_number: lotNumber, ...data };
  }
}

@Injectable()
export class GrnsService {
  constructor(private databaseService: DatabaseService) {}

  async generateGrn(procurementId: string): Promise<any> {
    const procurement = await this.databaseService.query(
      `SELECT * FROM procurements WHERE id = ?`,
      [procurementId]
    );
    if (procurement.length === 0) throw new Error('Procurement not found');
    
    const proc = procurement[0];
    const id = uuidv4();
    const grnNumber = `GRN-${Date.now()}`;
    const qrPayload = JSON.stringify({
      grn_id: id,
      procurement_id: procurementId,
      farmer_id: proc.farmer_id,
      crop_enrollment_id: proc.crop_enrollment_id,
      net_qty: proc.net_qty,
      grade: proc.grade,
      date: new Date().toISOString()
    });

    await this.databaseService.execute(
      `INSERT INTO grns (id, grn_number, procurement_id, lot_id, farmer_id, net_weight, grade, total_amount, payment_mode, payment_status, qr_payload, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'created', datetime('now'), datetime('now'))`,
      [id, grnNumber, procurementId, proc.lot_id, proc.farmer_id, proc.net_qty, proc.grade, proc.amount, proc.payment_mode, proc.payment_status, qrPayload]
    );

    await this.databaseService.execute(
      `UPDATE procurements SET lot_id = ? WHERE id = ?`,
      [proc.lot_id, procurementId]
    );

    return { id, grn_number: grnNumber, qr_payload: qrPayload };
  }

  async getGrnById(id: string): Promise<any> {
    const results = await this.databaseService.query(
      `SELECT * FROM grns WHERE id = ?`,
      [id]
    );
    return results.length > 0 ? results[0] : null;
  }
}

@Injectable()
export class VendorsService {
  constructor(private databaseService: DatabaseService) {}

  async createVendor(data: any): Promise<any> {
    const id = uuidv4();
    const code = `VND-${Date.now().toString().slice(-6)}`;
    await this.databaseService.execute(
      `INSERT INTO vendors (id, name, code, gst_number, contact_person, contact_mobile, contact_email, address, warehouse_lat, warehouse_lng, capacity_mt, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'))`,
      [id, data.name, code, data.gst_number, data.contact_person, data.contact_mobile, data.contact_email, data.address, data.warehouse_lat, data.warehouse_lng, data.capacity_mt]
    );
    return { id, code, ...data };
  }
}

@Injectable()
export class DispatchesService {
  constructor(private databaseService: DatabaseService) {}

  async createDispatch(data: any): Promise<any> {
    const id = uuidv4();
    const dispatchNumber = `DSP-${Date.now()}`;
    await this.databaseService.execute(
      `INSERT INTO dispatches (id, dispatch_number, lot_id, grn_id, from_center_id, to_vendor_id, dispatch_date, vehicle_number, driver_name, driver_mobile, dispatched_qty, expected_delivery_date, status, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'created', ?, datetime('now'))`,
      [id, dispatchNumber, data.lot_id, data.grn_id, data.from_center_id, data.to_vendor_id, data.dispatch_date, data.vehicle_number, data.driver_name, data.driver_mobile, data.dispatched_qty, data.expected_delivery_date, data.created_by]
    );
    return { id, dispatch_number: dispatchNumber, ...data };
  }

  async confirmDelivery(dispatchId: string, data: any): Promise<any> {
    await this.databaseService.execute(
      `INSERT INTO delivery_confirmations (id, dispatch_id, received_qty, received_at, quality_observations, discrepancy_notes, discrepancy_percent, confirmed_by, created_at)
       VALUES (?, ?, ?, datetime('now'), ?, ?, ?, ?, datetime('now'))`,
      [uuidv4(), dispatchId, data.received_qty, data.quality_observations, data.discrepancy_notes, data.discrepancy_percent, data.confirmed_by]
    );
    await this.databaseService.execute(
      `UPDATE dispatches SET status = 'delivered' WHERE id = ?`,
      [dispatchId]
    );
    return { dispatchId, ...data };
  }
}

@Injectable()
export class DashboardService {
  constructor(private databaseService: DatabaseService) {}

  async getAgentDashboard(agentId: string): Promise<any> {
    const farmers = await this.databaseService.query(
      `SELECT COUNT(*) as count FROM farmer_program_mapping WHERE agent_id = ?`,
      [agentId]
    );
    const pendingSurveys = await this.databaseService.query(
      `SELECT COUNT(*) as count FROM survey_instances WHERE assigned_agent_id = ? AND status = 'open'`,
      [agentId]
    );
    const completedSurveys = await this.databaseService.query(
      `SELECT COUNT(*) as count FROM survey_instances WHERE assigned_agent_id = ? AND status = 'submitted'`,
      [agentId]
    );
    const totalProcurement = await this.databaseService.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM procurements WHERE created_by = ?`,
      [agentId]
    ]);

    return {
      total_farmers: farmers[0]?.count || 0,
      pending_surveys: pendingSurveys[0]?.count || 0,
      completed_surveys: completedSurveys[0]?.count || 0,
      total_procurement_value: totalProcurement[0]?.total || 0
    };
  }

  async getProgramDashboard(programId: string): Promise<any> {
    const agents = await this.databaseService.query(
      `SELECT COUNT(*) as count FROM agent_program_mapping WHERE program_id = ?`,
      [programId]
    );
    const farmers = await this.databaseService.query(
      `SELECT COUNT(*) as count FROM farmer_program_mapping WHERE program_id = ?`,
      [programId]
    );
    const enrollments = await this.databaseService.query(
      `SELECT COUNT(*) as count FROM crop_enrollments WHERE program_id = ?`,
      [programId]
    );

    return {
      total_agents: agents[0]?.count || 0,
      total_farmers: farmers[0]?.count || 0,
      total_crop_enrollments: enrollments[0]?.count || 0
    };
  }
}

@Injectable()
export class SyncService {
  constructor(private databaseService: DatabaseService) {}

  async queueRecord(tableName: string, recordId: string, operation: string, data: any): Promise<any> {
    const id = uuidv4();
    await this.databaseService.execute(
      `INSERT INTO sync_queue (id, table_name, record_id, operation, data_json, local_timestamp, status, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'), 'pending', datetime('now'))`,
      [id, tableName, recordId, operation, JSON.stringify(data)]
    );
    return { id };
  }

  async processSyncBatch(records: any[]): Promise<any> {
    const results = [];
    for (const record of records) {
      try {
        await this.databaseService.execute(
          `UPDATE sync_queue SET sync_timestamp = datetime('now'), status = 'synced' WHERE id = ?`,
          [record.id]
        );
        results.push({ id: record.id, success: true });
      } catch (error) {
        await this.databaseService.execute(
          `UPDATE sync_queue SET retry_count = retry_count + 1, error_message = ? WHERE id = ?`,
          [error.message, record.id]
        );
        results.push({ id: record.id, success: false, error: error.message });
      }
    }
    return results;
  }
}