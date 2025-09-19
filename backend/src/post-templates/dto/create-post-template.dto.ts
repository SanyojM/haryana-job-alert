import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreatePostTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  structure: Record<string, any>;
}