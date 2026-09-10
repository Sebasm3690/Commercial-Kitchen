import { InventoryRepository } from '../repositories/inventory.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateInventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute(
    name: string,
    quantity: number,
    kitchenId: string,
    unit: string,
    batchNumber: string,
    expirationDate: string,
  ) {
    return this.inventoryRepository.createInventory(
      name,
      quantity,
      kitchenId,
      unit,
      batchNumber,
      new Date(expirationDate),
    );
  }
}
