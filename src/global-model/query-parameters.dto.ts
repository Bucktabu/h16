import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { SortDirections, SortParametersModel } from './sort-parameters.model';
import { BanStatusModel } from "./ban-status.model";

export class QueryParametersDto {
  @IsEnum(BanStatusModel)
  @IsOptional()
  @Transform(({ value }) => {
    if (value === BanStatusModel.Banned) {
      return true
    } else if (value === BanStatusModel.NotBanned) {
      return false
    }
  })
  banStatus: string = ''

  @IsEnum(SortParametersModel)
  @IsOptional()
  sortBy: string = SortParametersModel.CreatedAt;

  @IsEnum(SortDirections)
  @IsOptional()
  sortDirection: string = SortDirections.Distending;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  pageNumber = 1;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  pageSize = 10;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  searchNameTerm = '';

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  searchLoginTerm = '';

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  searchEmailTerm = '';
}
