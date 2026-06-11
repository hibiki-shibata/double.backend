import z from "zod"

export const userNameField = z.string('userName length must be min=4 max=10').min(4).max(10)
export const displayNameField = z.string('displayName length must be min=1 max=10').min(1).max(20)
export const emailAddressField = z.email('emailAddress validation failed')
export const passwordField = z.string('password length must be min=8 max=25').min(8).max(25)