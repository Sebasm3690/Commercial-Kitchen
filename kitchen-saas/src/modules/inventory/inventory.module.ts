import { Module } from '@nestjs/common';
import { InventoryController } from './controllers/inventory.controller';
import { DeductInventoryService } from './use-cases/deduct-inventory.service';
import { InventoryRepository } from './repositories/inventory.repository';
import { PgInventoryRepository } from './repositories/pg-inventory.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GetInventoryBatchesService } from './use-cases/get-inventory-batches.service';
import { CreateInventoryService } from './use-cases/create-inventory-batch.service';

@Module({
  imports: [PrismaModule],
  controllers: [InventoryController],
  providers: [
    DeductInventoryService,
    GetInventoryBatchesService,
    CreateInventoryService,
    {
      provide: InventoryRepository,
      useClass: PgInventoryRepository,
    },
  ],
})
export class InventoryModule {}
