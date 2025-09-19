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
  content_json: Record<string, any>;

  @IsString()
  @IsOptional()
  content_html?: string;

  @IsString()
  @IsOptional()
  thumbnail_url?: string;

  @IsString()
  @IsOptional()
  external_url?: string;

  @IsArray()
  @IsInt({ each: true })
  @ArrayNotEmpty()
  @IsOptional()
  tags?: number[]; // Array of tag IDs
}