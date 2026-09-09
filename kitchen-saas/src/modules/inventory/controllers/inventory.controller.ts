import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
} from '@nestjs/common';
import { DeductInventoryService } from '../use-cases/deduct-inventory.service';
import { DeductInventoryDto } from '../dtos/deduct-inventory.dto';
import { Body, Post } from '@nestjs/common';
import { GetInventoryBatchesService } from '../use-cases/get-inventory-batches.service';
import { CreateInventoryService } from '../use-cases/create-inventory-batch.service';
import { CreateInventoryDto } from '../dtos/create-inventory.dto';

@Controller('Inventory')
export class InventoryController {
  constructor(
    private readonly deductInventoryService: DeductInventoryService,
    private readonly getInventoryBatchesService: GetInventoryBatchesService,
    private readonly createInventoryBatchesService: CreateInventoryService,
  ) {}

  @Post('deduct')
  async deduct(@Body() payload: DeductInventoryDto) {
    try {
      await this.deductInventoryService.execute(payload.id, payload.amount);

      return {
        status: 'success',
        message: `Successfully ${payload.amount} units deducted`,
      };
    } catch (error) {
      // Translating Domain Errors to HTTP Status Codes
      if (error instanceof Error) {
        if (error.message === 'INSUFFICIENT_INVENTORY') {
          throw new ConflictException(
            'Not enough inventory in this batch or batch does not exist',
          );
        }
        if (error.message === 'INVALID_DEDUCTION_AMOUNT') {
          throw new BadRequestException(
            'Amount to deduct must be greater than zero',
          );
        }
      }
      // 🚨 ADD THIS LINE to expose the real database crash to your terminal
      console.error('🔥 FATAL ERROR:', error);

      // If it's an unexpected error, throw a 500
      throw new InternalServerErrorException('Failed to deduct inventory');
    }
  }

  @Get()
  async getInventoryBatches() {
    try {
      const inventory = await this.getInventoryBatchesService.execute();
      return {
        status: 'success',
        message: 'Fetched all Inventory Batches',
        data: inventory,
      };
    } catch (error) {
      console.error('FATAL ERROR:', error);
      throw new InternalServerErrorException(
        'Failed to fetch inventory batches',
      );
    }
  }

  @Post()
  async postInventoryBatch(@Body() payload: CreateInventoryDto) {
    try {
      const inventory = await this.createInventoryBatchesService.execute(
        payload.ingredientName,
        payload.currentQuantity,
      );
      return {
        status: 'success',
        data: inventory,
      };
    } catch (error) {
      console.error('FATAL ERROR', error);
      throw new InternalServerErrorException(
        'Failed to create inventory batch',
      );
    }
  }
}
