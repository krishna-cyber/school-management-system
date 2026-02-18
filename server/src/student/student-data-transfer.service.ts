import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Student } from './schemas/student.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';

@Injectable()
export class StudentDataTransferService {
  constructor(
    @InjectQueue('importQueue') private readonly importQueue: Queue,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(Class.name) private readonly classModel: Model<Class>,
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
