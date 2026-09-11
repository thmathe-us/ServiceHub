import { ServicesService } from '../services/services.service';
export declare class HealthcheckService {
    private readonly servicesService;
    private readonly logger;
    constructor(servicesService: ServicesService);
    checkServiceStatus(serviceId: string): Promise<{
        status: string;
        responseTime: number;
        lastCheck: Date;
        lastError: any;
    }>;
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
}
