import { HealthcheckService } from './healthcheck.service';
import { ServicesService } from '../services/services.service';
export declare class HealthcheckController {
    private readonly healthcheckService;
    private readonly servicesService;
    constructor(healthcheckService: HealthcheckService, servicesService: ServicesService);
    checkAllServices(): Promise<({
        serviceId: string;
        status: string;
        success: boolean;
        error?: undefined;
    } | {
        serviceId: string;
        status: string;
        success: boolean;
        error: any;
    })[]>;
    checkServiceStatus(serviceId: string): Promise<{
        status: string;
        responseTime: number;
        lastCheck: Date;
        lastError: any;
    }>;
    getServiceStatus(serviceId: string): Promise<{
        status: import(".prisma/client").$Enums.ServiceStatus;
        responseTime: number;
        lastCheck: Date;
        lastError: string;
    }>;
}
