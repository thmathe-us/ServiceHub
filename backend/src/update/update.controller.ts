import { Controller, Get, Post } from '@nestjs/common';
import { UpdateService } from './update.service';

/**
 * Endpoint to manually trigger an update check.
 * Can be protected with auth guards as needed.
 */
@Controller('update')
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @Post()
  async trigger() {
    await this.updateService.checkForUpdates();
    return { status: 'update check executed' };
  }

  @Get('version')
  async getVersion() {
    return this.updateService.getVersionInfo();
  }
}
