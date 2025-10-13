import { IsInt } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  mock_series_id: number;
}