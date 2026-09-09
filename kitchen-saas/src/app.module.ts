import { Module } from '@nestjs/common';
import { InventoryModule } from './modules/inventory/inventory.module';
import { PrismaModule } from './prisma/prisma.module';
import { RecipeModule } from './modules/recipe/recipe.module';

@Module({
  imports: [PrismaModule, InventoryModule, RecipeModule],
})
export class AppModule {}
