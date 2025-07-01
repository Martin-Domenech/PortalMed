import jwt from 'jsonwebtoken'
import config from '../config/config.js'

const authMiddleware = (req, res, next) => {
    const token = req.cookies.authToken

    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó token' });
    }
    
    jwt.verify(token, config.secret_key, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido o expirado' });
        req.user = decoded
        next()
    })
}

export default authMiddleware