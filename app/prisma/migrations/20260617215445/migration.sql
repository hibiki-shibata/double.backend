/*
  Warnings:

  - You are about to drop the column `wallet_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_wallet_id_fkey";

-- AlterTable
ALTER TABLE "Bet" ALTER COLUMN "bet_amount" SET DATA TYPE BIGINT,
ALTER COLUMN "payout_amount" SET DEFAULT 0,
ALTER COLUMN "payout_amount" SET DATA TYPE BIGINT,
ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "version" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Market" ALTER COLUMN "status" SET DEFAULT 'upcoming';

-- AlterTable
ALTER TABLE "Prediction" ALTER COLUMN "bet_sum" SET DATA TYPE BIGINT,
ALTER COLUMN "status" SET DEFAULT 'upcoming',
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "version" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "wallet_id",
ALTER COLUMN "roles" SET DEFAULT ARRAY['user']::"UserRoles"[];

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "currency" SET DEFAULT 'USD',
ALTER COLUMN "reserved_amount" SET DEFAULT 0,
ALTER COLUMN "version" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "prediction_transaction" ALTER COLUMN "bet_amount" SET DATA TYPE BIGINT,
ALTER COLUMN "bet_sum_before" SET DATA TYPE BIGINT,
ALTER COLUMN "bet_sum_after" SET DATA TYPE BIGINT,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "wallet_transaction" ALTER COLUMN "amount" SET DATA TYPE BIGINT,
ALTER COLUMN "balance_before" SET DATA TYPE BIGINT,
ALTER COLUMN "balance_after" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
