import { IsMongoId } from 'class-validator';

export class GenerateMarksheetDto {
  @IsMongoId()
  studentId: string;
  @IsMongoId()
  examId: string;
}
