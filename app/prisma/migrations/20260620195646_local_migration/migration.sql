/*
  Warnings:

  - The values [pending,locked,won,lost,payout,cancelled] on the enum `BetStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [upcoming,opened,closed,resolved,payout,cancelled] on the enum `MarketStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [upcoming,open,resolved,won,lost,cancelled] on the enum `PredictionStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [bet,refund,cancel] on the enum `PredictionTransactionType` will be removed. If these variants are still used in the database, this will fail.
  - The values [user,admin,deleted] on the enum `UserRoles` will be removed. If these variants are still used in the database, this will fail.
  - The values [active,suspend,deleted] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [active,suspended] on the enum `WalletStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [deposit,withdraw,bet,payout,refund,cancel] on the enum `WalletTransactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `market_id` on the `Bet` table. All the data in the column will be lost.
  - Made the column `payout_amount` on table `Bet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BetStatus_new" AS ENUM ('PENDING', 'LOCKED', 'WON', 'LOST', 'PAYOUT', 'CANCELLED');
ALTER TABLE "public"."Bet" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Bet" ALTER COLUMN "status" TYPE "BetStatus_new" USING ("status"::text::"BetStatus_new");
ALTER TYPE "BetStatus" RENAME TO "BetStatus_old";
ALTER TYPE "BetStatus_new" RENAME TO "BetStatus";
DROP TYPE "public"."BetStatus_old";
ALTER TABLE "Bet" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MarketStatus_new" AS ENUM ('UPCOMING', 'OPEN', 'CLOSED', 'RESOLVED', 'PAYOUT', 'CANCELLED');
ALTER TABLE "public"."Market" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Market" ALTER COLUMN "status" TYPE "MarketStatus_new" USING ("status"::text::"MarketStatus_new");
ALTER TYPE "MarketStatus" RENAME TO "MarketStatus_old";
ALTER TYPE "MarketStatus_new" RENAME TO "MarketStatus";
DROP TYPE "public"."MarketStatus_old";
ALTER TABLE "Market" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PredictionStatus_new" AS ENUM ('UPCOMING', 'OPEN', 'RESOLVED', 'WON', 'LOST', 'CANCELLED');
ALTER TABLE "public"."Prediction" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Prediction" ALTER COLUMN "status" TYPE "PredictionStatus_new" USING ("status"::text::"PredictionStatus_new");
ALTER TYPE "PredictionStatus" RENAME TO "PredictionStatus_old";
ALTER TYPE "PredictionStatus_new" RENAME TO "PredictionStatus";
DROP TYPE "public"."PredictionStatus_old";
ALTER TABLE "Prediction" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PredictionTransactionType_new" AS ENUM ('BET', 'REFUND', 'CANCEL');
ALTER TABLE "prediction_transaction" ALTER COLUMN "transaction_type" TYPE "PredictionTransactionType_new" USING ("transaction_type"::text::"PredictionTransactionType_new");
ALTER TYPE "PredictionTransactionType" RENAME TO "PredictionTransactionType_old";
ALTER TYPE "PredictionTransactionType_new" RENAME TO "PredictionTransactionType";
DROP TYPE "public"."PredictionTransactionType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRoles_new" AS ENUM ('USER', 'ADMIN', 'DELETED');
ALTER TABLE "public"."User" ALTER COLUMN "roles" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "roles" TYPE "UserRoles_new"[] USING ("roles"::text::"UserRoles_new"[]);
ALTER TYPE "UserRoles" RENAME TO "UserRoles_old";
ALTER TYPE "UserRoles_new" RENAME TO "UserRoles";
DROP TYPE "public"."UserRoles_old";
ALTER TABLE "User" ALTER COLUMN "roles" SET DEFAULT ARRAY['USER']::"UserRoles"[];
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('ACTIVE', 'SUSPEND', 'DELETED');
ALTER TABLE "User" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "public"."UserStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "WalletStatus_new" AS ENUM ('ACTIVE', 'SUSPENDED');
ALTER TABLE "public"."Wallet" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Wallet" ALTER COLUMN "status" TYPE "WalletStatus_new" USING ("status"::text::"WalletStatus_new");
ALTER TYPE "WalletStatus" RENAME TO "WalletStatus_old";
ALTER TYPE "WalletStatus_new" RENAME TO "WalletStatus";
DROP TYPE "public"."WalletStatus_old";
ALTER TABLE "Wallet" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "WalletTransactionType_new" AS ENUM ('DEPOSIT', 'WITHDRAW', 'BET', 'PAYOUT', 'REFUND', 'CANCEL');
ALTER TABLE "wallet_transaction" ALTER COLUMN "type" TYPE "WalletTransactionType_new" USING ("type"::text::"WalletTransactionType_new");
ALTER TYPE "WalletTransactionType" RENAME TO "WalletTransactionType_old";
ALTER TYPE "WalletTransactionType_new" RENAME TO "WalletTransactionType";
DROP TYPE "public"."WalletTransactionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_market_id_fkey";

-- DropIndex
DROP INDEX "Bet_market_id_idx";

-- AlterTable
ALTER TABLE "Bet" DROP COLUMN "market_id",
ALTER COLUMN "currency" SET DEFAULT 'USD',
ALTER COLUMN "payout_amount" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Market" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';

-- AlterTable
ALTER TABLE "Prediction" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "roles" SET DEFAULT ARRAY['USER']::"UserRoles"[];

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "Bet_status_idx" ON "Bet"("status");

-- CreateIndex
CREATE INDEX "Market_status_idx" ON "Market"("status");

-- CreateIndex
CREATE INDEX "Market_closed_at_idx" ON "Market"("closed_at");

-- CreateIndex
CREATE INDEX "prediction_transaction_prediction_id_idx" ON "prediction_transaction"("prediction_id");

-- AddForeignKey
ALTER TABLE "prediction_transaction" ADD CONSTRAINT "prediction_transaction_prediction_id_fkey" FOREIGN KEY ("prediction_id") REFERENCES "Prediction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
