import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class AttendanceEntry {
  @IsMongoId()
  studentId: string;

  @IsEnum(['present', 'absent', 'leave'])
  status: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class CreateAttendanceDto {
  @IsMongoId()
  class: string;

  @IsDateString()
  date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceEntry)
  attendance: AttendanceEntry[];
}
