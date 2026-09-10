import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  Get,
  Param,
} from '@nestjs/common';
import { CreateRecipeService } from '../use-cases/create-recipe.service';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';
import { GetRecipesService } from '../use-cases/get-recipes.service';
import { DeductRecipeService } from '../use-cases/deduct-recipe.service';

@Controller('recipes')
export class RecipeController {
  constructor(
    private readonly createRecipeService: CreateRecipeService,
    private readonly getRecipeService: GetRecipesService,
    private readonly deductRecipeService: DeductRecipeService,
  ) {}

  @Post(':id/cook')
  async cookRecipe(
    @Param('id') recipeId: string,
    @Body('kitchenId') kitchenId: string,
  ) {
    await this.deductRecipeService.execute(recipeId, kitchenId, 'user_1');
    return {
      message: 'Recipe successfully prepared and inventory deducted',
    };
  }

  @Post()
  async createRecipe(@Body() payload: CreateRecipeDto) {
    try {
      const recipe = await this.createRecipeService.execute(
        payload.name,
        payload.description || '',
        payload.recipeIngredients,
      );
      return {
        status: 'success',
        data: recipe,
      };
    } catch (error) {
      console.error('FATAL ERROR', error);
      throw new InternalServerErrorException('Failed to create recipe');
    }
  }

  @Get()
  async getRecipess() {
    try {
      const recipes = await this.getRecipeService.execute();
      return {
        status: 'success',
        data: recipes,
      };
    } catch (error) {
      console.error('Fatal error', error);
      throw new InternalServerErrorException('Failed to get recipes');
    }
  }
}
