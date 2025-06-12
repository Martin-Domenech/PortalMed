import { 
    getPatientPaginated,
    registerPatient,
    detelePatient,
    getPatientService,
    updatePatientService
    } from '../services/patientServices.js'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'


export const patients = async (req, res) => {
    try {
        const { search, page , limit = 10 } = req.query
        const userId = req.user.id
        const query = {
            user: userId,
        }
        if (search) {
            const searchTerms = decodeURIComponent(search).split(' ')
            query.$or = []

            searchTerms.forEach(term => {
                query.$or.push(
                    { first_name: { $regex: term, $options: 'i' } },
                    { last_name: { $regex: term, $options: 'i' } },
                    { dni: { $regex: term, $options: 'i' } }
                )
            })
        }

        const options = {
            page,
            limit,
            sort: { last_name: -1 }
        }

        const patients = await getPatientPaginated(query, options)

        res.status(200).json(patients)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener pacientes' })
    }
}

export const getPatient = async (req, res) => {
    const { patientID } = req.params
    try {   
        const data = await getPatientService(patientID)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener paciente' })
    }
}

export const registerPatientController = async (req, res) => {
    try {

        const token = req.cookies.authToken
        if (!token) {
            return res.status(401).json({ message: 'No se ha proporcionado un token de autenticación' })
        }
        const decoded = jwt.verify(token, config.secret_key)
        const userId = decoded.id

        const newPatient = {
            ...req.body,
            user: userId,
        }
        const result = await registerPatient(newPatient, userId)
        res.status(201).json({ message: 'Paciente registrado con éxito', patient: result })

    } catch (error) {
        console.error('Error al registrar el paciente:', error)
        res.status(500).json({ message: 'Error al registrar el paciente', error: error.message })
    }

}

export const deletePatientController = async (req, res) => {
    const { patientID } = req.params
    try {
        const result = await detelePatient(patientID)
        if(result){
            return res.status(200).json({ message: "paciente eliminado con exito "})
        }else{
            return res.status(404).json({ message: "Paciente no enocntrado" })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar el paciente', error })
    }
}

export const updatePatientController = async (req, res) => {
    const patient = req.body
    const { id } = req.params
    try {
        const result = await updatePatientService(patient, id)
        if(result){
            return res.status(200).json({ message: "paciente actualizado con exito "})
        }else{
            return res.status(404).json({ message: "Paciente no actualizado" })
        } 
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar el paciente', error })
    }
}