import { Module } from '@nestjs/common';
import { CropEnrollmentsService } from './crop-enrollments.service';

@Module({
  providers: [CropEnrollmentsService],
  exports: [CropEnrollmentsService],
})
export class CropEnrollmentsModule {}

@Module({
  providers: [SurveysService],
  exports: [SurveysService],
})
export class SurveysModule {}

@Module({
  providers: [InputsService],
  exports: [InputsService],
})
export class InputsModule {}

@Module({
  providers: [SamplingService],
  exports: [SamplingService],
})
export class SamplingModule {}

@Module({
  providers: [HarvestsService],
  exports: [HarvestsService],
})
export class HarvestsModule {}

@Module({
  providers: [ProcurementsService],
  exports: [ProcurementsService],
})
export class ProcurementsModule {}

@Module({
  providers: [GrnsService],
  exports: [GrnsService],
})
export class GrnsModule {}

@Module({
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}

@Module({
  providers: [DispatchesService],
  exports: [DispatchesService],
})
export class DispatchesModule {}

@Module({
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}

@Module({
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}