import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

export class ContactDto {
  @IsPhoneNumber()
  @IsArray({ each: true })
  @IsOptional()
  phoone_number: string[];

  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  email: string[];
}
class ParentDto {
  @IsString()
  @Max(255)
  full_name: string;

  @IsString()
  @IsOptional()
  photo: string;

  @IsString()
  @IsEnum(['Teacher', 'Engineer', 'Doctor', 'Business', 'Agriculture', 'Other'])
  occupation: string;

  @IsString()
  @IsEnum([
    'slc',
    'intermediate',
    'bachelor',
    'master',
    'phd',
    'illiterate',
    'other',
  ])
  qualification: string;

  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contact: ContactDto;
}

export class CreateStudentDto {
  @IsString()
  @Max(255)
  full_name: string;

  @IsDate()
  date_of_birth: Date;

  @IsString()
  photo: string;

  @IsString()
  address: string;

  @IsMongoId()
  class: Types.ObjectId;

  @ValidateNested({ each: true })
  @Type(() => ParentDto)
  parent: ParentDto;
}
