import bcrypt from "bcryptjs"

export const HashPassword = (password: string) => {
    return Bun.password.hashSync(password, {
        algorithm: "bcrypt",
        cost: 4
    })
}


export const VerifyPassword = (password: string, hash: string) => {
    return Bun.password.verifySync(password, hash)
}