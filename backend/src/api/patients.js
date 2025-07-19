import { Router } from 'express'
import { 
    patients, 
    registerPatientController, 
    deletePatientController, 
    getPatient,
    updatePatientController
} from '../controllers/patientController.js'
import authMiddleware from '../middlewares/authMiddlewores.js'


const router = Router()

router.get('/', authMiddleware, patients)

router.get('/:patientID', authMiddleware, getPatient)

router.post('/register', authMiddleware, registerPatientController)

router.delete('/delete/:patientID', authMiddleware, deletePatientController)

router.put('/update/:id', authMiddleware, updatePatientController)

export default router