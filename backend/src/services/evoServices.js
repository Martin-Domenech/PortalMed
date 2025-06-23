import evoService from '../models/evo.js'

export const getEvoByIdService = async (patientId) => {
    try{
        const data = await evoService.find({ patient: patientId }).sort({ createdAt: -1 });
        return data
    }catch{
        throw new Error('Error al buscar evoluciones: ' + error.message)
    }
}

export const registerEvoService = async (newEvo) => {
    try{
        const result = await evoService.create(newEvo)
        return result
    }catch{
        throw new Error('Error al crear la evolución: ' + error.message)
    }
}

export const deleteEvoService = async (evoId) => {
    try {
        const result = await evoService.findByIdAndDelete(evoId)
        return result
    } catch (error) {
        throw new Error('Error al registrar paciente: ' + error.message)
    }
}

export const updateEvoService = async (updateEvo, evoId) => {
    try {
        const result = await evoService.findByIdAndUpdate(evoId, updateEvo, { new: true, runValidators: true })
        return result
    } catch (error) {
        throw error
    }
}