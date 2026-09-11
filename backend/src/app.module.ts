import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigsModule } from './configs/configs.module';
import { LogsModule } from './logs/logs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UpdateController } from './update/update.controller';
import { UpdateService } from './update/update.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    AuthModule,
    UsersModule,
    ServicesModule,
    CategoriesModule,
    ConfigsModule,
    LogsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [UpdateController],
  providers: [UpdateService],
})
export class AppModule {}