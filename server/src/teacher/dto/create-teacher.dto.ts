import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
export class TeacherContactDto {
  @ApiPropertyOptional({
    description: 'The phone numbers of the contact',
    example: ['+1234567890', '+0987654321'],
  })
  @IsPhoneNumber(undefined, { each: true })
  @IsArray()
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
export class CreateTeacherDto {
  @ApiProperty()
  @MaxLength(255)
  @IsString()
  full_name: string;

  @ApiProperty({
    description: 'The contact information of the teacher',
    type: TeacherContactDto,
  })
  @ValidateNested({ each: true })
  @Type(() => TeacherContactDto)
  contact: TeacherContactDto;

  @ApiProperty({
    description: 'The salary of the teacher',
    example: 50000,
  })
  @IsNumber()
  salary: number;

  @ApiPropertyOptional({
    description: 'The photo of the teacher',
    example: 'http://example.com/photo.jpg',
  })
  @IsOptional()
  @IsString()
  photo: string;

  @ApiProperty({
    enumName: 'Gender',
    enum: ['male', 'female', 'other'],
    description: 'The gender of the teacher',
    example: 'male',
  })
  @IsString()
  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @ApiProperty({
    description: 'The qualification of the teacher',
    example: 'MSc in Computer Science',
  })
  @IsString()
  qualification: string;
}

export class CreateTeacherResponseDto {
  @ApiProperty({
    description: 'Indicates whether the teacher was created successfully',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'A message describing the result of the operation',
    example: 'Teacher registered successfully',
  })
  message: string;
}
