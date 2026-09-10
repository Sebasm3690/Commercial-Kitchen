import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { KitchenGateway } from '../../events/gateways/kitchen.gateway';

@Injectable()
export class DeductRecipeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kitchenGateway: KitchenGateway,
  ) {}

  //Finding the Cookbook: We ask the database to open the cookbook and find the exact recipe we want to cook, including all the ingredients it needs
  async execute(recipeId: string, kitchenId: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { recipeIngredients: { include: { ingredient: true } } },
    });

    if (!recipe) throw new BadRequestException('Recipe not found');

    //$transaction creates a magical safety bubble.
    //Everything inside this tx block is temporary.
    //If anything goes wrong inside this bubble, it instantly undoes all the changes, like rewinding time.
    await this.prisma.$transaction(async (tx) => {
      //tx is the same that this.prisma... but this is not permanent
      //For every ingredient we need, we ask the database to fetch the boxes from the fridge
      //We always use the oldest food first.
      for (const req of recipe.recipeIngredients) {
        let amountNeeded = req.quantityRequired;
        const batches = await tx.inventoryBatch.findMany({
          where: {
            ingredientName: req.ingredient.name,
            kitchenId: kitchenId,
            currentQuantity: { gt: 0 },
          },
          orderBy: { expirationDate: 'asc' },
        });

        // 2. Deduct across batches
        for (const batch of batches) {
          if (amountNeeded <= 0) break;

          const deductAmount = Math.min(
            Number(batch.currentQuantity),
            amountNeeded,
          );
          amountNeeded -= deductAmount;

          const updatedBatch = await tx.inventoryBatch.update({
            where: { id: batch.id },
            data: { currentQuantity: { decrement: deductAmount } },
          });

          // 3. Append Audit Log
          await tx.auditLog.create({
            data: {
              batchId: batch.id,
              userId: userId,
              action: 'COOKING',
              quantityChanged: -deductAmount,
              reason: `Prepared Recipe: ${recipe.name}`,
            },
          });

          // 4. Broadcast real-time update
          this.kitchenGateway.broadcastInventoryUpdate(
            kitchenId,
            batch.id,
            updatedBatch.currentQuantity,
          );
        }

        // 5. The Rollback Trigger
        if (amountNeeded > 0) {
          throw new BadRequestException(
            `Insufficient stock for ${req.ingredient.name}. Missing ${amountNeeded} units. Transaction rolled back.`,
          );
        }
      }
    });
  }
}
