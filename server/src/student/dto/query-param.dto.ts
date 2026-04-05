import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListAllEntities {
  @IsMongoId()
  @IsOptional()
  class?: string;

  @IsString()
  @IsOptional()
  section?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
