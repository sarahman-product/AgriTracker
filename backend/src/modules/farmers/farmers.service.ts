import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../db/database.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FarmersService {
  constructor(private databaseService: DatabaseService) {}

  async createFarmer(data: any): Promise<any> {
    const id = uuidv4();
    await this.databaseService.execute(
      `INSERT INTO farmers (id, name, mobile, father_name, gender, date_of_birth, village, district, state, pincode, gps_location_json, aadhar_number, farmer_category, is_fpo_member, is_shg_member, kyc_status, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, datetime('now'), datetime('now'))`,
      [id, data.name, data.mobile, data.father_name, data.gender, data.date_of_birth, data.village, data.district, data.state, data.pincode, JSON.stringify(data.gps_location || {}), data.aadhar_number, data.farmer_category, data.is_fpo_member ? 1 : 0, data.is_shg_member ? 1 : 0, data.created_by]
    );
    return { id, ...data };
  }

  async getFarmers(programId?: string, agentId?: string): Promise<any[]> {
    if (programId && agentId) {
      return this.databaseService.query(
        `SELECT f.* FROM farmers f
         INNER JOIN farmer_program_mapping fpm ON f.id = fpm.farmer_id
         WHERE fpm.program_id = ? AND fpm.agent_id = ?
         ORDER BY f.created_at DESC`,
        [programId, agentId]
      );
    }
    return this.databaseService.query(
      `SELECT * FROM farmers ORDER BY created_at DESC LIMIT 100`
    );
  }

  async getFarmerById(id: string): Promise<any> {
    const results = await this.databaseService.query(
      `SELECT * FROM farmers WHERE id = ?`,
      [id]
    );
    return results.length > 0 ? results[0] : null;
  }

  async searchFarmers(query: string): Promise<any[]> {
    return this.databaseService.query(
      `SELECT * FROM farmers WHERE name LIKE ? OR mobile LIKE ? LIMIT 20`,
      [`%${query}%`, `%${query}%`]
    );
  }

  async mapFarmerToProgram(data: any): Promise<any> {
    const id = uuidv4();
    await this.databaseService.execute(
      `INSERT INTO farmer_program_mapping (id, farmer_id, program_id, cluster_id, agent_id, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'active', datetime('now'))`,
      [id, data.farmer_id, data.program_id, data.cluster_id, data.agent_id]
    );
    return { id, ...data };
  }

  async updateKycStatus(farmerId: string, status: string, reason?: string): Promise<any> {
    await this.databaseService.execute(
      `UPDATE farmers SET kyc_status = ?, kyc_rejection_reason = ?, updated_at = datetime('now') WHERE id = ?`,
      [status, reason, farmerId]
    );
    return { farmerId, status, reason };
  }
}