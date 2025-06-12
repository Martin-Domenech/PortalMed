import { Router } from 'express'
import { register, login, logout, isLogged } from '../controllers/sessionController.js'
const router = Router()

router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

router.get('/islogged', isLogged)

export default router