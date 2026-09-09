import { InventoryRepository } from '../repositories/inventory.repository';
import { Injectable } from '@nestjs/common';
import { InventoryBatch } from '../entities/inventory-batch.entity';

@Injectable()
export class CreateInventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute(name: string, quantity: number) {
    return this.inventoryRepository.createInventory(name, quantity);
  }
}
