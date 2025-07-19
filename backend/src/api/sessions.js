import { Router } from 'express'
import { 
  register,
  login,
  logout,
  isLogged,
  registerSecretary,
  getSecretary
} from '../controllers/sessionController.js'
import authMiddleware from '../middlewares/authMiddlewores.js'
import authorizeRoles from '../middlewares/authRoleMiddlewore.js'
const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/islogged', authMiddleware, isLogged)
router.post('/register-secretary', authMiddleware, authorizeRoles('user', 'admin'), registerSecretary)
router.get('/secretary', authMiddleware, authorizeRoles('user', 'admin'), getSecretary)


export default router