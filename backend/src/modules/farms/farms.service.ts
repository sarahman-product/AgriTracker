import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../db/database.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FarmsService {
  constructor(private databaseService: DatabaseService) {}

  async createFarm(data: any): Promise<any> {
    const id = uuidv4();
    await this.databaseService.execute(
      `INSERT INTO farms (id, farmer_id, farm_name, area_acres, ownership_type, soil_type, irrigation_type, land_survey_number, centroid_lat, centroid_lng, gps_accuracy, boundary_json, calculated_area, is_gps_verified, farm_photos_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [id, data.farmer_id, data.farm_name, data.area_acres, data.ownership_type, data.soil_type, data.irrigation_type, data.land_survey_number, data.centroid_lat, data.centroid_lng, data.gps_accuracy, JSON.stringify(data.boundary || []), data.calculated_area, data.is_gps_verified ? 1 : 0, JSON.stringify(data.photos || [])]
    );
    return { id, ...data };
  }

  async getFarms(farmerId: string): Promise<any[]> {
    return this.databaseService.query(
      `SELECT * FROM farms WHERE farmer_id = ? ORDER BY created_at DESC`,
      [farmerId]
    );
  }

  async getFarmById(id: string): Promise<any> {
    const results = await this.databaseService.query(
      `SELECT * FROM farms WHERE id = ?`,
      [id]
    );
    return results.length > 0 ? results[0] : null;
  }
}