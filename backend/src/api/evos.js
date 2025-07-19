import { Router } from 'express'
import { 
    getEvosById,
    registerEvoController,
    deleteEvoController,
    updateEvoController
} from '../controllers/evoController.js'
import uploadMiddleware from '../middlewares/uploadMiddleware.js'
import authorizeRoles from '../middlewares/authRoleMiddlewore.js'
import authMiddleware from '../middlewares/authMiddlewores.js'


const router = Router()

router.get('/:patientId', authMiddleware, authorizeRoles('user'), getEvosById)
router.post('/register/:patientId', authMiddleware, uploadMiddleware.array('archivos', 5), authorizeRoles('user'), registerEvoController)
router.delete('/delete/:evoId', authMiddleware, authorizeRoles('user'), deleteEvoController)
router.put('/update/:evoId', authMiddleware, uploadMiddleware.array('archivos', 5), authorizeRoles('user'), updateEvoController)

export default router