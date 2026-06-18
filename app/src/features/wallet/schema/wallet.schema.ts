import z from "zod"
import { Currency, WalletStatus, WalletTransactionType } from "../../../shared/infra/db/generated.prisma/client.js"

export const walletSchema = {
    id: z.uuidv4(),
    userId: z.uuidv4(),
    balance: z.bigint('Balance must be positive & 0').nonnegative(),
    reservedAmount: z.bigint('Rererved amount cannont be negative').nonnegative(),
    currency: z.enum(Currency),
    status: z.enum(WalletStatus),
    updatedAt: z.date()
}

export const walletResponseSchema = z.object({
    id: walletSchema.id,
    balance: walletSchema.balance,
    reservedAmount: walletSchema.reservedAmount,
    currency: walletSchema.currency,
    status: walletSchema.status
})

export const walletTransactionResponseSchema = z.object({
    id: z.uuidv4(),
    type: z.enum(WalletTransactionType),
    amount: z.bigint('Transaction amount should be less than 10000000').max(10000000n),
    balanceBefore: z.bigint('Rererved amount cannont be negative').nonnegative(),
    balanceAfter: z.bigint('Rererved amount cannont be negative').nonnegative(),
    createdAt: z.date(),
})

export const depositRequestSchema = z.object({
    amount: z.bigint('Deposit amount must be less than 10000000 at one transaction time. No negative value').max(10000000n).nonnegative()
})

export const withdrawRequestSchema = z.object({
    amount: z.bigint('Withdrawal amount must be less than 100000n at one transaction time. No negative value').max(100000n).nonnegative()
})

export type WalletResponse = z.infer<typeof walletResponseSchema>
export type WalletTransactionResponse = z.infer<typeof walletTransactionResponseSchema>
export type DepositRequest = z.infer<typeof depositRequestSchema>
export type WithdrawRequest = z.infer<typeof withdrawRequestSchema>