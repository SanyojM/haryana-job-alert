import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsNumber, IsArray, ArrayMinSize } from 'class-validator';

export class CreateMockSeriesDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsInt()
  category_id: number;

  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @IsOptional()
  tagIds?: number[];
}