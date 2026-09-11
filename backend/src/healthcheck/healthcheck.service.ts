import { Injectable, Logger } from '@nestjs/common';
import { ServicesService } from '../services/services.service';
import axios from 'axios';
import * as ping from 'ping';
import * as https from 'https';

@Injectable()
export class HealthcheckService {
  private readonly logger = new Logger(HealthcheckService.name);

  constructor(private readonly servicesService: ServicesService) {}

  async checkServiceStatus(serviceId: string) {
    try {
      const service = await this.servicesService.findById(serviceId);
      if (!service) {
        throw new Error('Service not found');
      }

      const startTime = Date.now();
      let status = 'OFFLINE';
      let responseTime = 0;
      let lastError = null;

      try {
        switch (service.checkType) {
          case 'HTTP':
          case 'HTTPS':
          case 'HEAD':
            const method = service.checkType === 'HEAD' ? 'head' : 'get';
            const isHttpsUrl = service.url.trim().toLowerCase().startsWith('https://');
            const response = await axios[method](service.url, {
              timeout: 5000,
              httpsAgent: isHttpsUrl
                ? new https.Agent({ rejectUnauthorized: false })
                : undefined,
              validateStatus: (status) => status >= 200 && status < 300,
            });
            
            responseTime = Date.now() - startTime;
            status = 'ONLINE';
            break;
            
          case 'ICMP':
            const host = service.url.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
            const pingResponse = await ping.promise.probe(host, {
              timeout: 5,
            });
            
            responseTime = typeof pingResponse.time === 'number' ? pingResponse.time : 0;
            status = pingResponse.alive ? 'ONLINE' : 'OFFLINE';
            break;
            
          default:
            throw new Error('Unsupported check type');
        }
      } catch (error) {
        responseTime = Date.now() - startTime;
        status = 'OFFLINE';
        lastError = error.message;
      }

      // Update service status
      await this.servicesService.updateStatus(serviceId, status as any, responseTime, lastError || undefined);

      return { status, responseTime, lastCheck: new Date(), lastError };
    } catch (error) {
      this.logger.error(`Error checking service ${serviceId}: ${error.message}`);
      throw error;
    }
  }

  async checkAllServices() {
    const services = await this.servicesService.findAll();

    return Promise.all(
      services
        .filter((service) => service.isActive)
        .map(async (service) => {
          try {
            const result = await this.checkServiceStatus(service.id);
            return { serviceId: service.id, status: result.status, success: true };
          } catch (error) {
            this.logger.error(`Failed to check service ${service.name} (${service.id}): ${error.message}`);
            return { serviceId: service.id, status: 'OFFLINE', success: false, error: error.message };
          }
        }),
    );
  }
}