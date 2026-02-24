import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { MarksService } from './marks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/student/schemas/student.schema';
import { Marksheet, MarksheetSchema } from './schemas/marksheet.schema';
import { BullModule } from '@nestjs/bullmq';
import { MarksheetWorker } from './exam.worker';
import { Class, ClassSchema } from 'src/class/schemas/class.schema';
import { TenantsMiddleware } from 'src/middlewares/tenants.middleware';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'marksheetGeneration' }),
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Marksheet.name, schema: MarksheetSchema },
      { name: Class.name, schema: ClassSchema },
    ]),
  ],
  controllers: [ExamController],
  providers: [ExamService, MarksService, MarksheetWorker],
})
export class ExamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(ExamController);
  }
}
