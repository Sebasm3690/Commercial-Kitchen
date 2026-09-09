import { Injectable } from '@nestjs/common';
import { InventoryRepository } from './inventory.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { InventoryBatch } from '@prisma/client';

@Injectable()
export class PgInventoryRepository implements InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deductQuantity(id: string, amount: number): Promise<boolean> {
    const result = await this.prisma.$executeRaw`
    UPDATE "InventoryBatch"
    SET "currentQuantity" = "currentQuantity" - ${amount}
    WHERE id = ${id} AND "currentQuantity" >= ${amount}; 
    `;

    return result > 0;
  }

  async getInventoryBatches(): Promise<InventoryBatch[]> {
    return this.prisma.inventoryBatch.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createInventory(name: string, quantity: number) {
    return this.prisma.inventoryBatch.create({
      data: {
        ingredientName: name,
        currentQuantity: quantity,
        unit: 'KG',
      },
    });
  }
}
