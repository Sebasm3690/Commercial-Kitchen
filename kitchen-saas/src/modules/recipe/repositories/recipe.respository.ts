import { Recipe } from '../entities/recipy.entity';

export abstract class RecipeRepository {
  abstract createRecipe(
    name: string,
    description: string,
    ingredients: { ingredientName: string; quantityRequired: number }[],
  ): Promise<any>;

  abstract getAllRecipes(): Promise<any[]>;
}
