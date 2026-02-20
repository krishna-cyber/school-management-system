import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class ImportStudentDto {
  @IsString()
  @MaxLength(255)
  full_name: string;

  @IsString()
  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @IsDate()
  @Type(() => Date)
  date_of_birth: Date;

  @IsOptional()
  @IsString()
  photo: string;

  @IsString()
  address: string;

  @IsString()
  @Type(() => String)
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
  class: string;
}

export class ImportParentDto {
  @IsString()
  @MaxLength(255)
  full_name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === null || value === undefined ? null : String(value),
  )
  photo: string | null;

  @IsString()
  @IsEnum(['teacher', 'engineer', 'doctor', 'business', 'agriculture', 'other'])
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

  @IsPhoneNumber(undefined, { each: true })
  @Transform(({ value }): string[] => {
    if (value === null || value === undefined || value === '') {
      return [];
    }
    const phoneNumbers = String(value);
    return phoneNumbers.split('|').map((phone) => `+977${phone.trim()}`);
  })
  phone_number: string[];

  @IsOptional()
  @IsEmail({}, { each: true })
  @IsArray()
  @Transform(({ value }): string[] => {
    if (value === null || value === undefined || value === '') {
      return [];
    }
    const emails = String(value);
    return emails.split('|').map((email) => email.trim());
  })
  email: string[];
}
