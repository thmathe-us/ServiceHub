"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const services_module_1 = require("./services/services.module");
const categories_module_1 = require("./categories/categories.module");
const configs_module_1 = require("./configs/configs.module");
const logs_module_1 = require("./logs/logs.module");
const healthcheck_module_1 = require("./healthcheck/healthcheck.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            services_module_1.ServicesModule,
            categories_module_1.CategoriesModule,
            configs_module_1.ConfigsModule,
            logs_module_1.LogsModule,
            healthcheck_module_1.HealthcheckModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map