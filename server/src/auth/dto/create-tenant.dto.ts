import {
  IsArray,
  IsEmail,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @MinLength(2)
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  password: string;
  image?: string;
  @IsString()
  tenantId: string;
  @IsString()
  address: string;

  @IsArray()
  @IsPhoneNumber(undefined, { each: true })
  contact?: string[];
}
