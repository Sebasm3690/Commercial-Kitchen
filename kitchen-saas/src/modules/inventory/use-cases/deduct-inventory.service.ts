import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository';

@Injectable()
export class DeductInventoryService {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async execute(id: string, amount: number): Promise<void> {
    if (amount <= 0) {
      throw new Error('INVALID_DEDUCTION_AMOUNT');
    }

    const success = await this.inventoryRepo.deductQuantity(id, amount);

    if (!success) {
      throw new Error('INSUFFICIENT_INVENTORY');
    }
  }
}
