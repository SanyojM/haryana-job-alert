import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateMockTestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  duration_minutes: number;

  @IsInt()
  total_marks: number;

  @IsBoolean()
  @IsOptional()
  is_free?: boolean;

  @IsInt()
  series_id: number;
}