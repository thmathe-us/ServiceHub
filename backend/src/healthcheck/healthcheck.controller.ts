import { Controller, Post, Param, UseGuards, Get } from '@nestjs/common';
import { HealthcheckService } from './healthcheck.service';
import { ServicesService } from '../services/services.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('healthcheck')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HealthcheckController {
  constructor(private readonly healthcheckService: HealthcheckService, private readonly servicesService: ServicesService) {}

  @Post('all')
  @Roles('ADMIN', 'OPERATOR', 'READER')
  async checkAllServices() {
    return this.healthcheckService.checkAllServices();
  }

  @Post(':id')
  @Roles('ADMIN', 'OPERATOR', 'READER')
  async checkServiceStatus(@Param('id') serviceId: string) {
    return this.healthcheckService.checkServiceStatus(serviceId);
  }

  @Get('status/:id')
  @Roles('ADMIN', 'OPERATOR', 'READER')
  async getServiceStatus(@Param('id') serviceId: string) {
    const service = await this.servicesService.findById(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }
    return {
      status: service.status,
      responseTime: service.responseTime,
      lastCheck: service.lastCheck,
      lastError: service.lastError,
    };
  }
}