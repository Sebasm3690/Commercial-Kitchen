import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty()
  ingredientName: string;

  @IsNumber()
  @IsNotEmpty()
  currentQuantity: number;

  @IsString()
  @IsNotEmpty()
  kitchenId: string;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsString()
  @IsNotEmpty()
  batchNumber: string;

  @IsDateString()
  @IsNotEmpty()
  expirationDate: string;
}
