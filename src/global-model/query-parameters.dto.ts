import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { SortDirections, SortParametersModel } from './sort-parameters.model';

export class QueryParametersDTO {
  @IsEnum(SortParametersModel)
  @IsOptional()
  sortBy: string = SortParametersModel.CreatedAt;

  @IsEnum(SortDirections)
  @IsOptional()
  sortDirection: string = SortDirections.Distending;

  @Transform(({ value }: TransformFnParams) => Number(value))
  @IsNumber()
  @IsOptional()
  pageNumber = 1;

  @Transform(({ value }: TransformFnParams) => Number(value))
  @IsNumber()
  @IsOptional()
  pageSize = 10;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  searchNameTerm = '';

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  searchLoginTerm = '';

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  searchEmailTerm = '';
}
