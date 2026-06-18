/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_user_id_key" ON "Wallet"("user_id");
