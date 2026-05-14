import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../db/database.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async requestOtp(mobile: string): Promise<{ success: boolean; message: string }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.databaseService.execute(
      `INSERT INTO otp_requests (id, mobile, otp, expires_at, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`,
      [uuidv4(), mobile, otp, expiresAt.toISOString()]
    );

    console.log(`OTP for ${mobile}: ${otp}`);
    
    return {
      success: true,
      message: 'OTP sent successfully',
    };
  }

  async verifyOtp(mobile: string, otp: string): Promise<any> {
    const otpRecord = await this.databaseService.query(
      `SELECT * FROM otp_requests 
       WHERE mobile = ? AND otp = ? AND expires_at > datetime('now')
       ORDER BY created_at DESC LIMIT 1`,
      [mobile, otp]
    );

    if (otpRecord.length === 0) {
      throw new Error('Invalid or expired OTP');
    }

    let user = await this.databaseService.query(
      `SELECT * FROM users WHERE mobile = ?`,
      [mobile]
    );

    if (user.length === 0) {
      const userId = uuidv4();
      await this.databaseService.execute(
        `INSERT INTO users (id, mobile, role, status, created_at, updated_at)
         VALUES (?, ?, 'field_agent', 'pending', datetime('now'), datetime('now'))`,
        [userId, mobile]
      );
      user = await this.databaseService.query(
        `SELECT * FROM users WHERE id = ?`,
        [userId]
      );
    }

    user = user[0];

    const payload = {
      sub: user.id,
      mobile: user.mobile,
      role: user.role,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '24h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    await this.databaseService.execute(
      `INSERT INTO user_sessions (id, user_id, token, refresh_token, expires_at, created_at)
       VALUES (?, ?, ?, ?, datetime('now', '+24 hours'), datetime('now'))`,
      [uuidv4(), user.id, token, refreshToken]
    );

    await this.databaseService.execute(
      `DELETE FROM otp_requests WHERE mobile = ?`,
      [mobile]
    );

    return {
      success: true,
      data: {
        token,
        refreshToken,
        user: {
          id: user.id,
          mobile: user.mobile,
          name: user.name,
          role: user.role,
          status: user.status,
        },
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.databaseService.query(
        `SELECT * FROM users WHERE id = ?`,
        [payload.sub]
      );

      if (user.length === 0) {
        throw new Error('User not found');
      }

      const newToken = this.jwtService.sign(
        { sub: user[0].id, mobile: user[0].mobile, role: user[0].role },
        { expiresIn: '24h' }
      );

      return { token: newToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async getProfile(userId: string): Promise<any> {
    const user = await this.databaseService.query(
      `SELECT id, mobile, name, email, role, status, created_at 
       FROM users WHERE id = ?`,
      [userId]
    );

    if (user.length === 0) {
      throw new Error('User not found');
    }

    const agentProfile = await this.databaseService.query(
      `SELECT * FROM agent_profiles WHERE user_id = ?`,
      [userId]
    );

    return {
      ...user[0],
      profile: agentProfile.length > 0 ? agentProfile[0] : null,
    };
  }
}