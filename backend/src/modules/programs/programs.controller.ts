import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { JwtAuthGuard } from '../../middleware/jwt-auth.guard';

@Controller('programs')
@UseGuards(JwtAuthGuard)
export class ProgramsController {
  constructor(private programsService: ProgramsService) {}

  @Get()
  async getPrograms() {
    return this.programsService.getPrograms();
  }

  @Get('assigned')
  async getAssignedPrograms(@Body() body: { userId: string }) {
    return this.programsService.getAssignedPrograms(body.userId);
  }

  @Get(':id')
  async getProgramById(@Param('id') id: string) {
    return this.programsService.getProgramById(id);
  }

  @Get(':id/config')
  async getProgramConfig(@Param('id') id: string) {
    return this.programsService.getProgramConfig(id);
  }

  @Post()
  async createProgram(@Body() data: any) {
    return this.programsService.createProgram(data);
  }

  @Post('clusters')
  async createCluster(@Body() data: { programId: string; name: string; state: string; district: string; block: string; villages: string[] }) {
    return this.programsService.createCluster(data.programId, data);
  }

  @Post('agent-mapping')
  async mapAgentToProgram(@Body() data: any) {
    return this.programsService.mapAgentToProgram(data);
  }
}

@Controller('crops')
export class CropsController {
  constructor(private programsService: ProgramsService) {}

  @Get('categories')
  async getCategories() {
    return this.programsService.getCropCategories();
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard)
  async createCategory(@Body() data: any) {
    return this.programsService.createCropCategory(data);
  }

  @Get()
  async getCrops(@Body() body: { groupId?: string }) {
    return this.programsService.getCrops(body.groupId);
  }

  @Get(':cropId/stages')
  @UseGuards(JwtAuthGuard)
  async getCropStages(@Param('cropId') cropId: string) {
    return this.programsService.getCropStages(cropId);
  }
}