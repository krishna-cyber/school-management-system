import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TenantsMiddleware } from 'src/middlewares/tenants.middleware';
import { ModelProvider } from 'src/providers/tenant-models.provider';
import { TenantConnectionProvider } from 'src/providers/tenant-connection.provider';

@Module({
  imports: [],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    TenantConnectionProvider,
    ModelProvider.attendanceModel,
  ],
})
export class AttendanceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(AttendanceController);
  }
}
