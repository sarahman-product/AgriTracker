import { Module } from '@nestjs/common';
import { ProgramsController, CropsController } from './programs.controller';
import { ProgramsService } from './programs.service';

@Module({
  controllers: [ProgramsController, CropsController],
  providers: [ProgramsService],
  exports: [ProgramsService],
})
export class ProgramsModule {}