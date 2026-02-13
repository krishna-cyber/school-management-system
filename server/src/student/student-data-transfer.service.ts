import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentDataTransferService {
  import() {
    return ' This action imports student data from excel file';
  }

  export() {
    return ' This action exports student data to excel file';
  }
}
