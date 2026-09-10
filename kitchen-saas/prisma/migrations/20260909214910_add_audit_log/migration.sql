/*
  Warnings:

  - Added the required column `batchNumber` to the `InventoryBatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationDate` to the `InventoryBatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kitchenId` to the `InventoryBatch` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('RESTOCK', 'COOKING', 'SPOILAGE', 'MANUAL_CORRECTION');

-- AlterTable
ALTER TABLE "InventoryBatch" ADD COLUMN     "batchNumber" TEXT NOT NULL,
ADD COLUMN     "expirationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "kitchenId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "quantityChanged" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "InventoryBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
