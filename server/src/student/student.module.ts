import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import { StudentDataTransferService } from './student-data-transfer.service';
import { BullModule } from '@nestjs/bullmq';
import { StudentProcessor } from './student.worker';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'importQueue' }),
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
  providers: [StudentService, StudentDataTransferService, StudentProcessor],
})
export class StudentModule {}
