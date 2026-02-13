import { Injectable } from '@nestjs/common';

@Injectable()
export class TeacherDataTransferService {
  import() {
    return ' This action imports teacher data from excel file';
  }

  export() {
    return ' This action exports teacher data to excel file';
  }
}
