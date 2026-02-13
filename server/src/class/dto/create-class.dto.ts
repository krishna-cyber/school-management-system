import { Type } from 'class-transformer';
import { IsOptional, IsString, Max, ValidateNested } from 'class-validator';

class SubjectDto {
  @IsString()
  name: string;

  @IsString()
  publication: string;
}

export class CreateClassDto {
  @IsString()
  @Max(70)
  title: string;

  @ValidateNested({ each: true })
  @Type(() => SubjectDto)
  cumpulsory_subjects: SubjectDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SubjectDto)
  optional_subject: SubjectDto[];
}
