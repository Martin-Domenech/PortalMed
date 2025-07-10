import { 
    getEvoByIdService,
    registerEvoService,
    deleteEvoService,
    updateEvoService
} from '../services/evoServices.js'

export const getEvosById = async (req, res) => {
    const { patientId } = req.params
    try{
        const data = await getEvoByIdService(patientId)
        res.status(200).json(data)
    }catch (error){
        res.status(500).json({ message: 'Error al obtener Evoluciones del paciente' })
    }
}

export const registerEvoController = async(req, res) => {
    const { patientId } = req.params
    try{
        const newEvo = {
            ...req.body,
            patient: patientId,
        }
        const result = await registerEvoService(newEvo)
        res.status(200).json({message: "Evolucion registrada con exito", "evo": result})
    }catch (error){
        console.error('Error al registrar el paciente:', error)
        res.status(500).json({ message: 'Error al registrar la evolucion', error: error.message })
    }
}

export const deleteEvoController = async(req, res) => {
    const { evoId } = req.params
    try{
        const result = await deleteEvoService(evoId)
        if(result){
            return res.status(200).json({ message: "Evolucion eliminada con exito "})
        }else{
            return res.status(404).json({ message: "Evolucion no enocntrado" })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar la evolucion', error })
    }
}

export const updateEvoController = async (req, res) => {
    const { evoId } = req.params
    const updateEvo = req.body
    try{
        const result = await updateEvoService(updateEvo, evoId)
        if(result){
            return res.status(200).json({ message: "Evolucion actualizada con exito "})
        }else{
            return res.status(404).json({ message: "Evolucion no actualizada" })
        } 
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar el paciente', error })
    }
}