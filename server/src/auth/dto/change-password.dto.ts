import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  newPassword: string;
  @IsString()
  currentPassword: string;

  @IsOptional()
  @IsBoolean()
  revokeOtherSessions?: boolean;
}
