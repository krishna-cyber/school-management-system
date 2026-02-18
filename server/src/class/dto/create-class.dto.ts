import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
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
    description: 'The level of the class',
    example: '10',
  })
  @IsString()
  @IsEnum([
    'Nursery',
    'L.K.G',
    'U.K.G',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
  ])
  level: string;

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
  optional_subjects: SubjectDto[];
}
