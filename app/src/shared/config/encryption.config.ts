import "dotenv/config"

type EncryptionConfig = {
    min_salt_rounds: number,
    max_salt_round: number,
    saltRound: number
}

export const encryptionConfig: EncryptionConfig = {
    min_salt_rounds: 10,
    max_salt_round: 15,
    saltRound: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '', 10)
}