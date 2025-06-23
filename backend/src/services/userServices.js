import userService from '../models/user.js'
import { createHash, isValidPassword } from '../utils/utils.js'


export const registerUser = async(userData) => {
    const { username, password } = userData;
    const existUser = await userService.findOne({ username })
    if (existUser) return { error: 'El usuario ya existe' }

    const newUser = {
        ...userData,
        password: createHash(password),
    };
    return await userService.create(newUser)
}

export const loginUser = async (username, password) => {
    const user = await userService.findOne({ username })
    if (!user || !isValidPassword(user, password)) throw new Error("credenciales incorrectas") 

    const { password: _, ...userData } = user.toObject()
    return userData
}