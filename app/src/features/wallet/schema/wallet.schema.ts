import { Currency, WalletStatus, WalletTransactionType } from "@global-shared/infra/db/generated.prisma/enums.js"
import z from "zod"

export const walletSchema = {
    depositRequest: z.object({
        amount: z.bigint('Deposit amount must be less than 10000000 at one transaction time. No negative value').max(10000000n).nonnegative()
    }),

    withdrawRequest: z.object({
        amount: z.bigint('Withdrawal amount must be less than 100000n at one transaction time. No negative value').max(100000n).nonnegative()
    }),

    response: z.object({
        id: z.uuidv4('wallet id must be uuidv4'),
        userId: z.uuidv4('user id must be uuidv4'),
        balance: z.bigint('balance must be non negative bigint').nonnegative(),
        currency: z.enum(Currency),
        reservedAmount: z.bigint('reservered amout must be non negative bigint').nonnegative(),
        status: z.enum(WalletStatus),
        updatedAt: z.iso.datetime('wrong date format')
    }),

    transactionResponse: z.object({
        id: z.uuidv4('wallet transaction id must be uuidv4'),
        userId: z.uuidv4('user id must be uuidv4'),
        walletId: z.uuidv4('wallet id must be uuidv4'),
        predictionId: z.uuidv4('prediction id must be uuidv4'),
        type: z.enum(WalletTransactionType),
        amount: z.bigint('amount must be non negative bigint').nonnegative(),
        balanceBefore: z.bigint('balanceBefore amout must be non negative bigint').nonnegative(),
        balanceAfter: z.bigint('BalanceAfter amout must be non negative bigint').nonnegative(),
        createdAt: z.iso.datetime('wrong date format')
    })
}

// Request
export type DepositRequest = z.infer<typeof walletSchema.depositRequest>

export type WithdrawRequest = z.infer<typeof walletSchema.withdrawRequest>

// Response
export type WalletResponse = z.infer<typeof walletSchema.response>

export type WalletTransactionResponse = z.infer<typeof walletSchema.transactionResponse>