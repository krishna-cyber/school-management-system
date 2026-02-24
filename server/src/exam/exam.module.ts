import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { MarksService } from './marks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Marksheet, MarksheetSchema } from './schemas/marksheet.schema';
import { BullModule } from '@nestjs/bullmq';
import { MarksheetWorker } from './exam.worker';
import { Class, ClassSchema } from 'src/class/schemas/class.schema';
import { TenantsMiddleware } from 'src/middlewares/tenants.middleware';
import { TenantConnectionProvider } from 'src/providers/tenant-connection.provider';
import { ModelProvider } from 'src/providers/tenant-models.provider';

@Module({
  imports: [BullModule.registerQueue({ name: 'marksheetGeneration' })],
  controllers: [ExamController],
  providers: [
    ExamService,
    MarksService,
    MarksheetWorker,
    TenantConnectionProvider,
    ModelProvider.examModel,
    ModelProvider.studentModel,
    ModelProvider.classModel,
    ModelProvider.marksheetModel,
  ],
})
export class ExamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(ExamController);
  }
}
