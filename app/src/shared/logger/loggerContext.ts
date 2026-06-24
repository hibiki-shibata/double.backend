import type { Logger } from "pino"

export interface LoggerContext {
    getLogger(): Logger
    run<T>(logger: Logger, callbacke: () => T): T
}