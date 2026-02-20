import { BadRequestException, Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import { StudentDataTransferService } from './student-data-transfer.service';
import { BullModule } from '@nestjs/bullmq';
import { StudentProcessor } from './student.worker';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { ClassModule } from 'src/class/class.module';

@Module({
  imports: [
    ClassModule,
    BullModule.registerQueue({ name: 'importQueue' }),
    //only register the student schema, the parent and contact schemas are used as subdocuments in the student schema
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),

    MulterModule.register({
      limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
      fileFilter(req, file, callback) {
        const allowedMimeTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Only Excel files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, './uploads');
        },
        filename(req, file, callback) {
          const ext = extname(file.originalname);
          const filename = `${Date.now()}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  ],
  controllers: [StudentController],
  providers: [StudentService, StudentDataTransferService, StudentProcessor],
  exports: [MongooseModule],
})
export class StudentModule {}
