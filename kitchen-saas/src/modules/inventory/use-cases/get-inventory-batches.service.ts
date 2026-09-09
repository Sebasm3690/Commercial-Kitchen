import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository';

@Injectable()
export class GetInventoryBatchesService {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async execute() {
    return this.inventoryRepo.getInventoryBatches();
  }
}
