import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Student } from './schemas/student.schema';
import { Model } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';

@Injectable()
export class StudentDataTransferService {
  constructor(
    @InjectQueue('importQueue') private readonly importQueue: Queue,
    @Inject('STUDENT_MODEL') private readonly studentModel: Model<Student>,
    @Inject('CLASS_MODEL') private readonly classModel: Model<Class>,
  ) {}
  async import(file: Express.Multer.File) {
    await this.importQueue.add('importQueue', {
      filePath: file.path,
      fileName: file.originalname,
      fileSize: file.size,
      timestamp: Date.now(),
    });

    return {
      success: true,
      message: 'Import job has been queued successfully',
    };
  }

  export() {
    return ' This action exports student data to excel file';
  }
}
