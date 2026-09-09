import { RecipeRepository } from '../repositories/recipe.respository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetRecipesService {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  execute(): Promise<any[]> {
    return this.recipeRepository.getAllRecipes();
  }
}
