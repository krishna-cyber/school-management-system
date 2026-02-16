import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class SubjectDto {
  @ApiProperty({
    description: 'The name of the subject',
    example: 'Mathematics',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The publication associated with the subject',
    example: 'Oxford University Press',
  })
  @IsString()
  publication: string;
}

export class CreateClassDto {
  @ApiProperty({
    description: 'The title of the class',
    example: 'Class 10',
  })
  @IsString()
  @MaxLength(70)
  title: string;

  @ApiProperty({
    description: 'The compulsory subjects for the class',
    type: [SubjectDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SubjectDto)
  compulsory_subjects: SubjectDto[];

  @ApiPropertyOptional({
    description: 'The optional subjects for the class',
    type: [SubjectDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SubjectDto)
  optional_subject: SubjectDto[];
}
