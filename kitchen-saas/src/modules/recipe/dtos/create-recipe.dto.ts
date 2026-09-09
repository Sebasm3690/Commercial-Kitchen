import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  Min,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class RecipeIngredientDto {
  @IsString()
  @IsNotEmpty()
  ingredientName: string;

  @IsNumber()
  @Min(0.1)
  quantityRequired: number;
}

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  recipeIngredients: RecipeIngredientDto[];
}
