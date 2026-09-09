import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class DeductInventoryDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @Min(0.01)
  amount: number;
}
