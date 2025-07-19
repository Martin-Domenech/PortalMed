import { Router } from 'express'
import {
  turnos,
  addTurno,
  deleteTurno,
} from '../controllers/turnoController.js'
import authMiddleware from '../middlewares/authMiddlewores.js'
const router = Router()


router.get('/', authMiddleware, turnos)
router.post('/addturno', authMiddleware, addTurno)
router.delete('/delete/:turnoID', authMiddleware, deleteTurno)

export default router