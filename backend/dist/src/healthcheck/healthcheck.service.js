"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HealthcheckService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthcheckService = void 0;
const common_1 = require("@nestjs/common");
const services_service_1 = require("../services/services.service");
const axios_1 = require("axios");
const ping = require("ping");
const https = require("https");
let HealthcheckService = HealthcheckService_1 = class HealthcheckService {
    constructor(servicesService) {
        this.servicesService = servicesService;
        this.logger = new common_1.Logger(HealthcheckService_1.name);
    }
    async checkServiceStatus(serviceId) {
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
                        const response = await axios_1.default[method](service.url, {
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
            }
            catch (error) {
                responseTime = Date.now() - startTime;
                status = 'OFFLINE';
                lastError = error.message;
            }
            await this.servicesService.updateStatus(serviceId, status, responseTime, lastError || undefined);
            return { status, responseTime, lastCheck: new Date(), lastError };
        }
        catch (error) {
            this.logger.error(`Error checking service ${serviceId}: ${error.message}`);
            throw error;
        }
    }
    async checkAllServices() {
        const services = await this.servicesService.findAll();
        return Promise.all(services
            .filter((service) => service.isActive)
            .map(async (service) => {
            try {
                const result = await this.checkServiceStatus(service.id);
                return { serviceId: service.id, status: result.status, success: true };
            }
            catch (error) {
                this.logger.error(`Failed to check service ${service.name} (${service.id}): ${error.message}`);
                return { serviceId: service.id, status: 'OFFLINE', success: false, error: error.message };
            }
        }));
    }
};
exports.HealthcheckService = HealthcheckService;
exports.HealthcheckService = HealthcheckService = HealthcheckService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [services_service_1.ServicesService])
], HealthcheckService);
//# sourceMappingURL=healthcheck.service.js.map