
import type { Logger } from 'pino'
import type { AsyncLocalStorage } from 'node:async_hooks'
import type { LoggerContext } from './loggerContext.js';

export class LoggerContextV1 implements LoggerContext {
    constructor(
        private readonly baseLogger: Logger,
        private readonly asyncLocalStorage: AsyncLocalStorage<Logger>
    ) { }

    getLogger(): Logger {
        return this.asyncLocalStorage.getStore() ?? this.baseLogger
    }

    run<T>(logger: Logger, callbacke: () => T): T {
        return this.asyncLocalStorage.run(logger, callbacke);
    }
}