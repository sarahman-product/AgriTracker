import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { FarmersService } from './farmers.service';
import { JwtAuthGuard } from '../../middleware/jwt-auth.guard';

@Controller('farmers')
export class FarmersController {
  constructor(private farmersService: FarmersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createFarmer(@Body() data: any) {
    return this.farmersService.createFarmer(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getFarmers(@Body() body: { programId?: string; agentId?: string }) {
    return this.farmersService.getFarmers(body.programId, body.agentId);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchFarmers(@Body() body: { query: string }) {
    return this.farmersService.searchFarmers(body.query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getFarmerById(@Param('id') id: string) {
    return this.farmersService.getFarmerById(id);
  }

  @Post('map-program')
  @UseGuards(JwtAuthGuard)
  async mapFarmerToProgram(@Body() data: any) {
    return this.farmersService.mapFarmerToProgram(data);
  }

  @Put(':id/kyc')
  @UseGuards(JwtAuthGuard)
  async updateKycStatus(@Param('id') id: string, @Body() body: { status: string; reason?: string }) {
    return this.farmersService.updateKycStatus(id, body.status, body.reason);
  }
}