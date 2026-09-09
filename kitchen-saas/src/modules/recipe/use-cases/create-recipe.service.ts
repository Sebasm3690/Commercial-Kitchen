import { Injectable } from '@nestjs/common';
import { RecipeRepository } from '../repositories/recipe.respository';

@Injectable()
export class CreateRecipeService {
  constructor(private readonly recipeRepo: RecipeRepository) {}

  async execute(name: string, description: string, ingredients: any[]) {
    return this.recipeRepo.createRecipe(
      name,
      description,
      ingredients as { ingredientName: string; quantityRequired: number }[],
    );
  }
}
