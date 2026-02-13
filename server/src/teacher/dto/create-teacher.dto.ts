import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContactDto } from 'src/student/dto/create-student.dto';

export class CreateTeacherDto {
  @IsString()
  full_name: string;

  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contact: ContactDto;

  @IsNumber()
  salary: number;

  @IsOptional()
  @IsString()
  photo: string;

  @IsString()
  qualification: string;
}
