import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TeacherDataTransferService } from './teacher-data-transfer.service';
import { TeacherProcessor } from './teacher.worker';
import { BullModule } from '@nestjs/bullmq';
import { TenantsMiddleware } from 'src/middlewares/tenants.middleware';
import { TenantConnectionProvider } from 'src/providers/tenant-connection.provider';
import { ModelProvider } from 'src/providers/tenant-models.provider';

@Module({
  imports: [BullModule.registerQueue({ name: 'teacherImportQueue' })],
  controllers: [TeacherController],
  providers: [
    TeacherService,
    TeacherDataTransferService,
    TeacherProcessor,
    TenantConnectionProvider,
    ModelProvider.teacherModel,
  ],
})
export class TeacherModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(TeacherController);
  }
}
