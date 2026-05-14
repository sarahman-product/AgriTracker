import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { FarmersModule } from './modules/farmers/farmers.module';
import { FarmsModule } from './modules/farms/farms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    ProgramsModule,
    FarmersModule,
    FarmsModule,
  ],
})
export class AppModule {}