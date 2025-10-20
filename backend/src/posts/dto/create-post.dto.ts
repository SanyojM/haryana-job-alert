import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsObject,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsInt()
  category_id: number;

  @IsInt()
  template_id: number;

  @IsObject()
  @IsOptional()
  content_json: Record<string, any>;

  @IsString()
  @IsOptional()
  content_html?: string;

  @IsString()
  @IsOptional()
  thumbnail_url?: string;

  @IsArray()
  @IsInt({ each: true })
  @ArrayNotEmpty()
  @IsOptional()
  tags?: number[]; // Array of tag IDs

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