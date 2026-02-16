import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateFeeDto {
  @ApiProperty({
    description: 'The title of the fee',
    example: 'Tuition Fee',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The type of the fee',
    enumName: 'FeeType',
    enum: ['tuition', 'transportation', 'hostel', 'miscellaneous'],
    example: 'tuition',
  })
  @IsString()
  @IsEnum(['tuition', 'transportation', 'hostel', 'miscellaneous'])
  type: string;

  @ApiProperty({
    description: 'The amount of the fee',
    example: 5000,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({
    description: 'The discount percentage for the fee',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  discount: number;

  @ApiProperty({
    description: 'The repetition pattern of the fee',
    enumName: 'Repetition',
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'one-time'],
    example: 'monthly',
  })
  @IsString()
  @IsEnum(['daily', 'weekly', 'monthly', 'yearly', 'one-time'])
  repetition: string;

  @ApiProperty({
    description: 'The date from which the fee is valid',
    example: '2024-01-01',
  })
  @Type(() => Date)
  @IsDate()
  valid_from: Date;

  @ApiPropertyOptional({
    description: 'The date until which the fee is valid',
    example: '2024-12-31',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  valid_to: Date;

  @ApiPropertyOptional({
    description: 'Whether the fee is currently active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
