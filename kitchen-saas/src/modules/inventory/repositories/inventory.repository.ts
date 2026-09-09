import { InventoryBatch } from '../entities/inventory-batch.entity';

export abstract class InventoryRepository {
  abstract deductQuantity(id: string, quantity: number): Promise<boolean>;
  abstract getInventoryBatches(): Promise<InventoryBatch[]>;
  abstract createInventory(
    name: string,
    quantity: number,
  ): Promise<InventoryBatch>;
}
