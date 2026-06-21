/*
  Warnings:

  - You are about to drop the column `closed_at` on the `Market` table. All the data in the column will be lost.
  - Added the required column `close_at` to the `Market` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Market_closed_at_idx";

-- AlterTable
ALTER TABLE "Market" DROP COLUMN "closed_at",
ADD COLUMN     "close_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Market_close_at_idx" ON "Market"("close_at");
