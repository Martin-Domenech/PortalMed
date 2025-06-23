import patientService from '../models/patient.js'
import userService from '../models/user.js'

export const getPatientPaginated = async (query, options) => {
    try {
        const patients = await patientService.paginate(query, options)
        return patients
    } catch (error) {
        throw new Error('Error al buscar paciente: ' + error.message);
    }
}

export const getPatientService = async (patientID) => {
    try {
        const data = await patientService.findById(patientID)
        return data
    } catch (error) {
        throw new Error('Error al buscar paciente: ' + error.message);
    }
}

export const registerPatient = async (newPatient, userId) => {
    try {
        const result = await patientService.create(newPatient)
        await userService.findByIdAndUpdate(userId, {
            $push: { patients: { patient: result._id } }
        })

        return result
    } catch (error) {
        throw new Error('Error al registrar paciente: ' + error.message)
    }
}

export const detelePatient = async(patientID) => {
    try {
        const result = await patientService.findByIdAndDelete(patientID)
        return result
    } catch (error) {
        throw new Error('Error al registrar paciente: ' + error.message)
    }
}

export const updatePatientService = async(patient, id) => {
    try {
        const result = await patientService.findByIdAndUpdate(id, patient, { new: true, runValidators: true })
        return result
    } catch (error) {
        throw error
    }
}
