import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import { registerUser, loginUser } from '../services/userServices.js'
import { authorization, passportCall } from '../utils/utils.js'

export const register = async (req, res) => {
    try {
        const userData = req.body
        const result = await registerUser(userData)
        if (result.error) return res.status(400).json({ message: result.error })
        res.status(201).json({ message: 'Usuario creado con éxito' })
    } catch (error) {
        console.error('Error al crear el usuario:', error)
        res.status(500).send(`Error al crear el usuario: ${error.message}`)
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userData = await loginUser(username, password);
        if (userData.error) return res.status(401).json({ message: 'credenciales incorrectas' })

        const { _id, first_name, last_name, role } = userData
        const token = jwt.sign({ id: _id, first_name, last_name, role }, config.secret_key, { expiresIn: "24h" })

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: config.node_env === 'production',
            /*maxAge: 24 * 60 * 60 * 1000*/
            maxAge: 60 * 1000, // esto es una porueba
        })

        res.json({ message: 'Autenticado correctamente' })
    } catch (error) {
        console.error('Error en el login:', error)
        res.status(401).json({ message: 'Credenciales incorrectas' })
    }
}

export const logout = (req, res) => {
    try{
        res.clearCookie('authToken')
        res.status(200).send({ message: 'Logout exitoso' })
    } catch(error){
        console.error(error)
        res.status(500).send({ message: 'Error al cerrar sesión' });
    }   
}

export const isLogged = (req, res) => {
    const token = req.cookies.authToken
    if(!token){
        return res.status(401).json({ message: 'Usuario no encontrado'})
    }

    passportCall('jwt')(req, res, (err) => {
        if(err) return res.status(401).json({ message: 'token invalido o expirado'})
        
        authorization(['user', 'admin'])(req, res, () => {
            res.status(200).json({ message: 'Usuario autenticado' })
        })
    })
} 

