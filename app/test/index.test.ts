// // https://vitest.dev/guide/learn/matchers.html

// import { expect, test } from 'vitest'

// test('adds 1 + 2 to equal 3', () => {
//   expect('afa').toBe('afa')
// })

// flatulent, skeeby, hunched, infernal, stipulate

// // tests/factories/marketFactory.ts
// import { PrismaClient, MarketStatus, PredictionStatus } from '@prisma/client';
// import { faker } from '@faker-js/faker';

// const prisma = new PrismaClient();

// export async function createMockMarketWithPredictions(overrides = {}) {
//   return await prisma.market.create({
//     data: {
//       title: faker.company.catchPhrase(),
//       status: MarketStatus.ACTIVE,
//       closeAt: faker.date.future(),
//       predictions: {
//         create: [
//           {
//             version: 1,
//             status: PredictionStatus.OPEN,
//             name: faker.lorem.words(3),
//             totalParticipants: faker.number.int({ min: 1, max: 100 }),
//             betSum: BigInt(5000000000), // Prisma handles BigInt natively
//           },
//         ],
//       },
//       ...overrides,
//     },
//     include: {
//       predictions: true, // Includes relations matching MarketWithPredictions
//     },
//   });
// }