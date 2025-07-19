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

export const createSecretaryService = async (secretaryData, doctorId) => {
  const { first_name, last_name, username, password } = secretaryData

  const existingSecretary = await userService.findOne({
    role: 'secretary',
    parentDoctor: doctorId
  })

  if (existingSecretary) {
    throw new Error('Este usuario ya tiene una secretaria asignada')
  }

  const existingUser = await userService.findOne({ username })
  if (existingUser) {
    throw new Error('El nombre de usuario ya está en uso')
  }

  const newSecretary = await userService.create({
    first_name,
    last_name,
    username,
    password: createHash(password),
    role: 'secretary',
    parentDoctor: doctorId
  })

  return newSecretary
}

export const getSecretaryByDoctorId = async (doctorId) => {
  const secretary = await userService.findOne({
    role: 'secretary',
    parentDoctor: doctorId
  }).select('_id username first_name last_name')

  return secretary
}