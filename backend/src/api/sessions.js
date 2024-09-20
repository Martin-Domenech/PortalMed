import { Router } from 'express'
import userService from '../models/user.js'
import { createHash, isValidPassword } from '../utils/utils.js'
import config from '../config/config.js'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/register', async (req,res) => {
    const { first_name, last_name, email, age, password, role } = req.body
    try{
        let user = await userService.findOne({ email })
        if (user) return res.status(400).send('El usuario ya existe');

        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role
        }

        let result = await userService.create(newUser)
        res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch(error){
        console.error('Error al crear el usuario:', error);
        res.status(500).send(`Error al crear el usuario: ${error.message}`);
    }
})

router.post('/login', async (req,res) => {
    try {
        const { email, password } = req.body
        const user = await userService.findOne({ email })
        if(!user || !isValidPassword(user, password)) return res.status(401).json({ message: 'credenciales incorrectas' })
        const { password: _, ...userData } = user.toObject();
        const token = jwt.sign({ ...userData }, config.secret_key, {expiresIn: "1h" })

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: config.node_env === 'production',
            maxAge: 60*60*1000
        })
        console.log(`token: ${token}`)

        res.json({ message: 'Autenticado correctamente' })
    } catch (error) {
        console.error(error)
    }
})

router.post('/logout', (req, res) => {
    try{
        res.clearCookie('authToken')
        res.status(200).send({ message: 'Logout exitoso' })
    } catch(error){
        console.error(error)
        res.status(500).send({ message: 'Error al cerrar sesión' });
    }   

})

export default router