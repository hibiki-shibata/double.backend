-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'suspend', 'deleted');

-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('user', 'admin', 'deleted');

-- CreateEnum
CREATE TYPE "WalletStatus" AS ENUM ('active', 'suspended');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'JPY');

-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('deposit', 'withdraw', 'bet', 'payout', 'refund', 'cancel');

-- CreateEnum
CREATE TYPE "MarketStatus" AS ENUM ('upcoming', 'opened', 'closed', 'resolved', 'payout', 'cancelled');

-- CreateEnum
CREATE TYPE "PredictionStatus" AS ENUM ('upcoming', 'open', 'resolved', 'won', 'lost', 'cancelled');

-- CreateEnum
CREATE TYPE "PredictionTransactionType" AS ENUM ('bet', 'refund', 'cancel');

-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('pending', 'locked', 'won', 'lost', 'payout', 'cancelled');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "email_address" TEXT,
    "password_hash" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL,
    "roles" "UserRoles"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "balance" BIGINT NOT NULL,
    "currency" "Currency" NOT NULL,
    "reserved_amount" INTEGER NOT NULL,
    "status" "WalletStatus" NOT NULL,
    "version" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transaction" (
    "id" TEXT NOT NULL,
    "wallet_id" TEXT NOT NULL,
    "prediction_id" TEXT,
    "type" "WalletTransactionType" NOT NULL,
    "currency" "Currency" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance_before" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Market" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "MarketStatus" NOT NULL,
    "closed_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL,
    "market_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "total_participants" INTEGER NOT NULL,
    "bet_sum" INTEGER NOT NULL,
    "status" "PredictionStatus" NOT NULL,
    "resolved_by_id" TEXT,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prediction_transaction" (
    "id" TEXT NOT NULL,
    "prediction_id" TEXT NOT NULL,
    "transaction_type" "PredictionTransactionType" NOT NULL,
    "total_participants_before" INTEGER NOT NULL,
    "total_participants_after" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,
    "bet_amount" INTEGER NOT NULL,
    "bet_sum_before" INTEGER NOT NULL,
    "bet_sum_after" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prediction_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "market_id" TEXT NOT NULL,
    "prediction_id" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "bet_amount" INTEGER NOT NULL,
    "payout_amount" INTEGER,
    "status" "BetStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_address_key" ON "User"("email_address");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE INDEX "User_email_address_idx" ON "User"("email_address");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_roles_idx" ON "User"("roles");

-- CreateIndex
CREATE INDEX "Wallet_user_id_idx" ON "Wallet"("user_id");

-- CreateIndex
CREATE INDEX "wallet_transaction_wallet_id_idx" ON "wallet_transaction"("wallet_id");

-- CreateIndex
CREATE INDEX "wallet_transaction_prediction_id_idx" ON "wallet_transaction"("prediction_id");

-- CreateIndex
CREATE INDEX "Prediction_market_id_idx" ON "Prediction"("market_id");

-- CreateIndex
CREATE INDEX "Prediction_resolved_by_id_idx" ON "Prediction"("resolved_by_id");

-- CreateIndex
CREATE INDEX "Bet_user_id_idx" ON "Bet"("user_id");

-- CreateIndex
CREATE INDEX "Bet_market_id_idx" ON "Bet"("market_id");

-- CreateIndex
CREATE INDEX "Bet_prediction_id_idx" ON "Bet"("prediction_id");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_prediction_id_fkey" FOREIGN KEY ("prediction_id") REFERENCES "Prediction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_resolved_by_id_fkey" FOREIGN KEY ("resolved_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_prediction_id_fkey" FOREIGN KEY ("prediction_id") REFERENCES "Prediction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
