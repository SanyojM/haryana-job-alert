import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsObject,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @Transform(({ value }) => parseInt(value)) // Add this
  @IsInt()
  category_id: number;
  
  @Transform(({ value }) => parseInt(value)) // Add this
  @IsInt()
  @IsOptional()
  template_id: number;

  @IsString()
  @IsNotEmpty()
  content_html?: string;

  @IsString()
  @IsOptional()
  thumbnail_url?: string;

  @Transform(({ value }) => {
    if (!value || value === '') return [];
    return value.split(',').map(Number);
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tags?: number[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  meta_title?: string;

  @IsString()
  @IsOptional()
  meta_description?: string;

  @IsString()
  @IsOptional()
  meta_keywords?: string;
}