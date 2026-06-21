import type { PasswordService } from './password.service.js'
import type { PasswordEncoderOptions } from '../../config/security.config.js'
import bcrypt from 'bcryptjs'
import { UnexpectedEnvVarErr } from '../../error/serverErros.js'
import { InvalidInputErr } from '../../error/httpErrors.js'

export class PasswordServiceV1 implements PasswordService {
    private readonly encoder: typeof bcrypt = bcrypt
    constructor(
        private readonly encodeOptions: PasswordEncoderOptions
    ) {
        if (!encodeOptions.saltRound) throw new UnexpectedEnvVarErr('Missing saldRounds')
        if (encodeOptions.saltRound < encodeOptions.minSaltRound || encodeOptions.saltRound > encodeOptions.maxSaltRound) {
            throw new UnexpectedEnvVarErr(`BCRYPT_SALT_ROUNDS must be between ${encodeOptions.minSaltRound} & ${encodeOptions.maxSaltRound}`)
        }
    }

    public async hashPassword(password: string): Promise<string> {
        return await this.encoder.hash(password, this.encodeOptions.saltRound)
    }

    public async verifyPassword(
        inputPassword: string,
        storedHashedPassword: string
    ): Promise<void> {
        const isPasswordValid: boolean = await this.encoder.compare(inputPassword, storedHashedPassword)
        if (!isPasswordValid) throw new InvalidInputErr('Input password was invalid')
    }
}