import type { PasswordService } from './password.service.js'
import type { PasswordEncoderOptions } from '../../../../shared/config/security.config.js'
import bcrypt from 'bcryptjs'
import { UnexpectedEnvVarErr } from '../../../../shared/error/serverErros.js'
import { InvalidInputErr } from '../../../../shared/error/httpErrors.js'

export class PasswordServiceV1 implements PasswordService {
    constructor(
        private readonly encodeOptions: PasswordEncoderOptions
    ) {
        if (!encodeOptions.saltRound) throw new UnexpectedEnvVarErr('Missing saldRounds')
        if (encodeOptions.saltRound <= encodeOptions.min_salt_rounds
            || encodeOptions.saltRound >= encodeOptions.max_salt_round) {
            throw new UnexpectedEnvVarErr(`BCRYPT_SALT_ROUNDS must be between ${encodeOptions.min_salt_rounds} & ${encodeOptions.max_salt_round}`)
        }
    }

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.encodeOptions.saltRound)
    }

    public async verifyPassword(
        inputPassword: string,
        storedHashedPassword: string
    ): Promise<void> {
        const isPasswordValid: boolean = await bcrypt.compare(inputPassword, storedHashedPassword)
        if (!isPasswordValid) throw new InvalidInputErr('Input password was invalid')
    }
}