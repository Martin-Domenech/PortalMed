import { Router } from 'express'
import { 
    getEvosById,
    registerEvoController,
    deleteEvoController,
    updateEvoController
} from '../controllers/evoController.js'
import uploadMiddleware from '../middlewares/uploadMiddleware.js'
import authMiddleware from '../middlewares/authMiddlewores.js'


const router = Router()

router.get('/:patientId', authMiddleware, getEvosById)
router.post('/register/:patientId', authMiddleware, uploadMiddleware.array('archivos', 5), registerEvoController)
router.delete('/delete/:evoId', authMiddleware, deleteEvoController)
router.put('/update/:evoId', authMiddleware, uploadMiddleware.array('archivos', 5), updateEvoController)

export default router