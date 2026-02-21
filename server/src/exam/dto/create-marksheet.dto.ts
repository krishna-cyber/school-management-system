import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';

export class SubjectMarkDto {
  @IsString()
  subject_name: string;
  @IsNumber()
  @IsPositive()
  @Max(100)
  full_marks: number;

  @IsNumber()
  @IsPositive()
  @Max(100)
  pass_marks: number;

  @IsNumber()
  @IsPositive()
  @Max(100)
  obtained_marks: number;

  @IsBoolean()
  is_optional: boolean;
}

export class CreateMarkSheetDto {
  @IsMongoId()
  student: string;

  @IsMongoId()
  exam: string;

  @IsMongoId()
  class: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SubjectMarkDto)
  subjects: SubjectMarkDto[];
}
