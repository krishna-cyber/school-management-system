import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentDataTransferService {
  import(file: Express.Multer.File) {
    return ` This action imports student data from excel file: ${file.originalname}`;
  }

  export() {
    return ' This action exports student data to excel file';
  }
}
