import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ConfigUpdateDto {
  key: string;
  value: any;
  description?: string;
}

@Injectable()
export class ConfigsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.systemConfig.findMany({
      orderBy: {
        key: 'asc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.systemConfig.findUnique({
      where: { id },
    });
  }

  async findByKey(key: string) {
    return this.prisma.systemConfig.findUnique({
      where: { key },
    });
  }

  async updateConfig(configData: ConfigUpdateDto) {
    const config = await this.findByKey(configData.key);
    
    if (config) {
      // Update existing config
      return this.prisma.systemConfig.update({
        where: { key: configData.key },
        data: {
          value: configData.value,
          description: configData.description || config.description,
        },
      });
    } else {
      // Create new config
      return this.prisma.systemConfig.create({
        data: {
          key: configData.key,
          value: configData.value,
          description: configData.description,
        },
      });
    }
  }

  async remove(id: string) {
    const config = await this.findById(id);
    if (!config) {
      throw new NotFoundException('Configuration not found');
    }

    await this.prisma.systemConfig.delete({
      where: { id },
    });

    return { message: 'Configuration removed successfully' };
  }
}