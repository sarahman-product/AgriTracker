import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../db/database.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProgramsService {
  constructor(private databaseService: DatabaseService) {}

  async createProgram(data: any): Promise<any> {
    const id = uuidv4();
    await this.databaseService.execute(
      `INSERT INTO programs (id, name, code, description, status, start_date, end_date, geography_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [id, data.name, data.code, data.description, data.status || 'active', data.start_date, data.end_date, JSON.stringify(data.geography || {})]
    );
    return { id, ...data };
  }

  async getPrograms(): Promise<any[]> {
    return this.databaseService.query(
      `SELECT * FROM programs WHERE status = 'active' ORDER BY created_at DESC`
    );
  }

  async getProgramById(id: string): Promise<any> {
    const results = await this.databaseService.query(
      `SELECT * FROM programs WHERE id = ?`,
      [id]
    );
    return results.length > 0 ? results[0] : null;
  }

  async getAssignedPrograms(userId: string): Promise<any[]> {
    return this.databaseService.query(
      `SELECT p.* FROM programs p
       INNER JOIN agent_program_mapping apm ON p.id = apm.program_id
       WHERE apm.user_id = ? AND apm.status = 'active' AND p.status = 'active'`,
      [userId]
    );
  }

  async getProgramConfig(programId: string): Promise<any> {
    const program = await this.getProgramById(programId);
    if (!program) return null;

    const crops = await this.databaseService.query(
      `SELECT pcm.*, c.name as crop_name, c.group_id
       FROM program_crop_mapping pcm
       INNER JOIN crops c ON pcm.crop_id = c.id
       WHERE pcm.program_id = ?`,
      [programId]
    );

    const uiConfig = await this.databaseService.query(
      `SELECT * FROM program_ui_config 
       WHERE program_id = ? AND is_enabled = 1 
       ORDER BY display_order`,
      [programId]
    );

    const clusters = await this.databaseService.query(
      `SELECT * FROM clusters WHERE program_id = ?`,
      [programId]
    );

    return {
      program,
      crops,
      uiConfig,
      clusters,
    };
  }

  async createCropCategory(data: any): Promise<any> {
    const id = uuidv4();
    await this.databaseService.execute(
      `INSERT INTO crop_categories (id, name, icon, description, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [id, data.name, data.icon, data.description, data.is_active ?? 1]
    );
    return { id, ...data };
  }

  async getCropCategories(): Promise<any[]> {
    return this.databaseService.query(
      `SELECT * FROM crop_categories WHERE is_active = 1`
    );
  }

  async getCrops(groupId?: string): Promise<any[]> {
    const query = groupId 
      ? `SELECT * FROM crops WHERE group_id = ?`
      : `SELECT * FROM crops`;
    const params = groupId ? [groupId] : [];
    return this.databaseService.query(query, params);
  }

  async getCropStages(cropId: string): Promise<any[]> {
    return this.databaseService.query(
      `SELECT * FROM crop_stages WHERE crop_id = ? ORDER BY stage_order`,
      [cropId]
    );
  }

  async createCluster(programId: string, data: any): Promise<any> {
    const id = uuidv4();
    await this.databaseService.execute(
      `INSERT INTO clusters (id, program_id, name, state, district, block, villages_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [id, programId, data.name, data.state, data.district, data.block, JSON.stringify(data.villages || [])]
    );
    return { id, programId, ...data };
  }

  async mapAgentToProgram(data: any): Promise<any> {
    const id = uuidv4();
    await this.databaseService.execute(
      `INSERT INTO agent_program_mapping (id, user_id, program_id, cluster_id, role, status, active_from, active_to, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [id, data.user_id, data.program_id, data.cluster_id, data.role || 'agent', data.status || 'active', data.active_from, data.active_to]
    );
    return { id, ...data };
  }
}