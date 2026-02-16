import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import { StudentDataTransferService } from './student-data-transfer.service';

@Module({
  imports: [
    //only register the student schema, the parent and contact schemas are used as subdocuments in the student schema
    MongooseModule.forFeatureAsync([
      {
        name: Student.name,
        useFactory: () => {
          const schema = StudentSchema;
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService, StudentDataTransferService],
})
export class StudentModule {}
