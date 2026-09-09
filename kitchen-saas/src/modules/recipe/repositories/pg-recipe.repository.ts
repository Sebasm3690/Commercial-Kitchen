import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecipeRepository } from './recipe.respository';

@Injectable()
export class PgRecipeRepository implements RecipeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRecipe(
    name: string,
    description: string,
    ingredients: { ingredientName: string; quantityRequired: number }[],
  ) {
    return this.prisma.recipe.create({
      data: {
        name,
        description,
        recipeIngredients: {
          create: ingredients.map((ingredient) => ({
            quantityRequired: ingredient.quantityRequired,
            ingredient: {
              connectOrCreate: {
                where: { name: ingredient.ingredientName },
                create: { name: ingredient.ingredientName },
              },
            },
          })),
        },
      },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async getAllRecipes(): Promise<any[]> {
    return this.prisma.recipe.findMany({
      include: {
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }
}
