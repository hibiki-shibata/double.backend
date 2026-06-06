// import { mock } from 'node:test'


// function makeMocks() {
//     const json = mock.fn<Response['json']>()
//     const status = mock.fn<Response['status']>(() => ({ json }) as Response)

//     const req = {
//         requestId: 'req-123',
//         logger: { error: mock.fn() },
//     } as unknown as Request

//     const res = { status } as unknown as Response
//     const next = mock.fn<NextFunction>()

//     return { req, res, next, json, status }
// }

// Doc: https://nodejs.org/learn/test-runner/using-test-runner
import assert from "node:assert/strict"
import { test } from 'node:test'


test('GlobalExceptionHandler.test.js Test', { concurrency: true }, t => {

    t.test('Fairst line of test', () => assert.equal('a', 'a'))
    // t.test('Fairst line of test', assert.AssertionError new

});