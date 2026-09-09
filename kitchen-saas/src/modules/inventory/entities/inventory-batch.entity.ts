export class InventoryBatch {
  id: string;
  ingredientName: string;
  currentQuantity: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<InventoryBatch>) {
    Object.assign(this, data);
  }
}
