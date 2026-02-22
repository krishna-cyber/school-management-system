import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class ImportTeacherDto {
  @IsString()
  @MaxLength(255)
  full_name: string;

  @IsString()
  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @IsNumber()
  @IsPositive()
  salary: number;

  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  @IsArray()
  @ArrayMinSize(1)
  phone_number: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  photo: string;

  @IsString()
  qualification: string;
}
