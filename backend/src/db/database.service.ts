import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, Client } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private client: Client;
  private url: string = '';
  private authToken: string = '';

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.url = this.configService.get<string>('DATABASE_URL') || '';
    this.authToken = this.configService.get<string>('DATABASE_AUTH_TOKEN') || '';
    
    this.client = createClient({
      url: this.url,
      authToken: this.authToken,
    });

    console.log('🔄 Connecting to Turso database...');
    await this.runMigrations();
  }

  async runMigrations() {
    try {
      const migrationsPath = path.join(process.cwd(), '..', 'database', 'migrations', '001_initial_schema.sql');
      
      if (!fs.existsSync(migrationsPath)) {
        console.log('⚠️ Migration file not found, skipping...');
        return;
      }

      const sql = fs.readFileSync(migrationsPath, 'utf8');
      const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
      
      console.log(`📦 Running ${statements.length} migration statements...`);
      
      let successCount = 0;
      let errorCount = 0;

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await this.client.execute({ sql: statement.trim(), args: [] });
            successCount++;
          } catch (err: any) {
            if (err.message?.includes('already exists')) {
              // Table already exists, that's fine
            } else {
              errorCount++;
              console.log(`⚠️ Error in statement: ${err.message}`);
            }
          }
        }
      }

      console.log(`✅ Database migration complete! (${successCount} statements, ${errorCount} errors)`);
      
      // Verify tables
      await this.verifyTables();
      
    } catch (error) {
      console.error('❌ Migration error:', error);
    }
  }

  async verifyTables() {
    try {
      const result = await this.client.execute({ 
        sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", 
        args: [] 
      });
      const tables = (result.rows as any[]).map(r => r.name);
      console.log(`📋 Connected tables: ${tables.join(', ')}`);
    } catch (error) {
      console.error('Error verifying tables:', error);
    }
  }

  getClient(): Client {
    return this.client;
  }

  async execute(sql: string, params: any[] = []) {
    try {
      const result = await this.client.execute({
        sql,
        args: params,
      });
      return result;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async query(sql: string, params: any[] = []): Promise<any[]> {
    try {
      const result = await this.client.execute({
        sql,
        args: params,
      });
      return (result.rows as any[]) || [];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async transaction(queries: { sql: string; params: any[] }[]) {
    const results: any[] = [];
    for (const { sql, params } of queries) {
      const result = await this.execute(sql, params);
      results.push(result);
    }
    return results;
  }
}