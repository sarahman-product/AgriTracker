import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, Client } from '@libsql/client';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private client: Client;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const url = this.configService.get<string>('DATABASE_URL');
    const authToken = this.configService.get<string>('DATABASE_AUTH_TOKEN');
    
    this.client = createClient({
      url,
      authToken,
    });
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

  async query(sql: string, params: any[] = []) {
    try {
      const result = await this.client.execute({
        sql,
        args: params,
      });
      return result.rows || [];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async transaction(queries: { sql: string; params: any[] }[]) {
    const results = [];
    for (const { sql, params } of queries) {
      const result = await this.execute(sql, params);
      results.push(result);
    }
    return results;
  }
}