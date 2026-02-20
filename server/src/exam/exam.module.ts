import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { MarksService } from './marks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/student/schemas/student.schema';
import { Marksheet, MarksheetSchema } from './schemas/marksheet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Marksheet.name, schema: MarksheetSchema },
    ]),
  ],
  controllers: [ExamController],
  providers: [ExamService, MarksService],
})
export class ExamModule {}
