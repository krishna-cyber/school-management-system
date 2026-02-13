import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from './schemas/teacher.schema';
import { TeacherDataTransferService } from './teacher-data-transfer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Teacher.name,
        schema: TeacherSchema,
      },
    ]),
  ],
  controllers: [TeacherController],
  providers: [TeacherService, TeacherDataTransferService],
})
export class TeacherModule {}
