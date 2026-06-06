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