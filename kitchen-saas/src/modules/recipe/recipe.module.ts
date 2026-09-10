import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RecipeController } from './controllers/recipe.controller';
import { CreateRecipeService } from './use-cases/create-recipe.service';
import { RecipeRepository } from './repositories/recipe.respository';
import { PgRecipeRepository } from './repositories/pg-recipe.repository';
import { GetRecipesService } from './use-cases/get-recipes.service';
import { DeductRecipeService } from './use-cases/deduct-recipe.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [RecipeController],
  providers: [
    CreateRecipeService,
    GetRecipesService,
    DeductRecipeService,
    {
      provide: RecipeRepository,
      useClass: PgRecipeRepository,
    },
  ],
})
export class RecipeModule {}
