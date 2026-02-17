import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class StudentDataTransferService {
  constructor(
    @InjectQueue('importQueue') private readonly importQueue: Queue,
  ) {}
  async import(file: Express.Multer.File) {
    await this.importQueue.add('importQueue', {
      filePath: file.path,
      timestamp: Date.now(),
    });
    return ` This action imports student data from excel file: ${file.originalname}`;
  }

  export() {
    return ' This action exports student data to excel file';
  }
}
