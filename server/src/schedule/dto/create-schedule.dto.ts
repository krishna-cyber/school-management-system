import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsString,
  ValidateNested,
} from 'class-validator'

export class periodDto {
  @IsString()
  startTime: string

  @IsString()
  endTime: string

  @IsString()
  subject: string

  @IsMongoId()
  teacher: string
}

export class CreateScheduleDto {
  @IsMongoId()
  classId: string

  @IsString()
  @IsEnum([
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ])
  day: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => periodDto)
  periods: periodDto[]
}
