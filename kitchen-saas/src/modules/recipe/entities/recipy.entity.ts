export class Recipe {
  id: string;
  name: string;
  description: string;
  recipeIngredients: {
    ingredientName: string;
    quantityRequired: number;
  }[];

  constructor(data: Partial<Recipe>) {
    Object.assign(this, data);
  }
}
