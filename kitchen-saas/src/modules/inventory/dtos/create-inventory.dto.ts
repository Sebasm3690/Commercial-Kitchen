import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty()
  ingredientName: string;

  @IsNumber()
  @IsNotEmpty()
  currentQuantity: number;
}
