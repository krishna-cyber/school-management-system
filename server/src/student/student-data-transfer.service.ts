import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'

@Injectable()
export class StudentDataTransferService {
  constructor(
    @InjectQueue('studentImportQueue') private readonly importQueue: Queue,
  ) {}
  async import(file: Express.Multer.File, tenantId: string) {
    await this.importQueue.add('studentImportQueue', {
      filePath: file.path,
      fileName: file.originalname,
      fileSize: file.size,
      timestamp: Date.now(),
      tenantId: tenantId,
    })

    return {
      success: true,
      message: 'Import job has been queued successfully',
    }
  }

  export() {
    return ' This action exports student data to excel file'
  }
}
