import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from './schemas/teacher.schema';
import { TeacherDataTransferService } from './teacher-data-transfer.service';
import { TeacherProcessor } from './teacher.worker';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Teacher.name,
        schema: TeacherSchema,
      },
    ]),
    BullModule.registerQueue({ name: 'teacherImportQueue' }),
  ],
  controllers: [TeacherController],
  providers: [TeacherService, TeacherDataTransferService, TeacherProcessor],
})
export class TeacherModule {}
