import { Router } from 'express'
import { 
    getEvosById,
    registerEvoController,
    deleteEvoController,
    updateEvoController
} from '../controllers/evoController.js'

import authMiddleware from '../middlewares/authMiddlewores.js'


const router = Router()

router.get('/:patientId', authMiddleware, getEvosById)
router.post('/register/:patientId', authMiddleware, registerEvoController)
router.delete('/delete/:evoId', authMiddleware, deleteEvoController)
router.put('/update/:evoId', authMiddleware, updateEvoController)

export default router