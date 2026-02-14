import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactDto {
  @ApiPropertyOptional({
    description: 'The phone numbers of the contact',
    example: ['+1234567890', '+0987654321'],
  })
  @IsPhoneNumber(undefined, { each: true })
  @IsArray()
  @IsOptional()
  phone_number: string[];

  @ApiPropertyOptional({
    description: 'The email addresses of the contact',
    example: ['contact@example.com'],
  })
  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  email: string[];
}
class ParentDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  full_name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  photo: string;

  @ApiProperty({
    description: 'The occupation of the parent',
    enumName: 'Occupation',
    enum: ['Teacher', 'Engineer', 'Doctor', 'Business', 'Agriculture', 'Other'],
    example: 'Teacher',
  })
  @IsString()
  @IsEnum(['Teacher', 'Engineer', 'Doctor', 'Business', 'Agriculture', 'Other'])
  occupation: string;

  @ApiProperty({
    description: 'The qualification of the parent',
    enumName: 'Qualification',
    enum: [
      'slc',
      'intermediate',
      'bachelor',
      'master',
      'phd',
      'illiterate',
      'other',
    ],
    example: 'bachelor',
  })
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

  @ApiProperty({
    description: 'The contact information of the parent',
    type: ContactDto,
    example: {
      phone_number: ['+1234567890'],
      email: ['parent@example.com'],
    },
  })
  @ValidateNested()
  @Type(() => ContactDto)
  contact: ContactDto;
}

export class CreateStudentDto {
  @ApiProperty({
    description: 'The full name of the student',
    example: 'John Doe',
  })
  @IsString()
  @MaxLength(255)
  full_name: string;

  @ApiProperty({
    description: 'The gender of the student',
    enumName: 'Gender',
    enum: ['male', 'female', 'other'],
    example: 'male',
  })
  @IsString()
  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @ApiProperty({
    description: 'The date of birth of the student',
    example: '2005-05-15',
  })
  @IsDate()
  @Type(() => Date)
  date_of_birth: Date;

  @ApiProperty({
    description: 'The url of the student photo',
    example: 'https://example.com/student-photo.jpg',
  })
  @IsString()
  photo: string;

  @ApiProperty({
    description: 'The address of the student',
    example: '123 Main St, Anytown, USA',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'The class id of the student',
    example: '60c72b2f9b1d8e5a5c8f9b1d',
  })
  @IsMongoId()
  class: Types.ObjectId;

  @ApiProperty({
    description: 'The parent information of the student',
    type: ParentDto,
    example: {
      full_name: 'Jane Doe',
      photo: 'https://example.com/parent-photo.jpg',
      occupation: 'Teacher',
      qualification: 'bachelor',
      contact: {
        phone_number: ['+1234567890'],
        email: ['jane.doe@example.com'],
      },
    },
  })
  @ValidateNested()
  @Type(() => ParentDto)
  parent: ParentDto;
}

export class CreateStudentResponseDto {
  @ApiProperty({
    description: 'Indicates whether the student was created successfully',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'A message describing the result of the operation',
    example: 'Student registered successfully',
  })
  message: string;
}
