import { 
  getPatientPaginated,
  registerPatient,
  detelePatient,
  getPatientService,
  updatePatientService,
} from '../services/patientServices.js'
import { deleteTurnosByPatientId } from '../services/turnoServices.js'


export const patients = async (req, res) => {
  try {
    const { search, page , limit = 10 } = req.query
    const { id, role, parentDoctor } = req.user
    const doctorId = role === 'secretary' ? parentDoctor : id
    const query = { user: doctorId }
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
  const { role, id: userId, parentDoctor } = req.user
  try {   
    const patient = await getPatientService(patientID)
    const doctorId = role === 'secretary' ? parentDoctor : userId

    if (!patient || String(patient.user) !== String(doctorId)) {
      return res.status(404).json({ message: 'Paciente no encontrado o acceso denegado' })
    }


    res.status(200).json(patient)
  } catch (error) {
    console.error('Error al obtener paciente:', error)
    res.status(500).json({ message: 'Error al obtener paciente' })
  }
}

export const registerPatientController = async (req, res) => {
  try {

    const { id, role, parentDoctor } = req.user
    const doctorId = role === 'secretary' ? parentDoctor : id

    const newPatient = {
      ...req.body,
      user: doctorId,
    }
    const result = await registerPatient(newPatient, doctorId)
    res.status(201).json({ message: 'Paciente registrado con éxito', patient: result })

  } catch (error) {
    console.error('Error al registrar el paciente:', error)
    res.status(500).json({ message: 'Error al registrar el paciente', error: error.message })
  }
}

export const deletePatientController = async (req, res) => {
  const { patientID } = req.params
  const { role, id: userId, parentDoctor } = req.user
  try {
    const patient = await getPatientService(patientID)
    const doctorId = role === 'secretary' ? parentDoctor : userId

    if (!patient || String(patient.user) !== String(doctorId)) {
      return res.status(404).json({ message: 'Paciente no encontrado o acceso denegado' })
    }

    await deleteTurnosByPatientId(patientID)

    const result = await detelePatient(patientID)
    if (result) {
      return res.status(200).json({ message: "Paciente eliminado con éxito" })
    } else {
      return res.status(404).json({ message: "Paciente no eliminado" })
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar el paciente', error })
  }
}

export const updatePatientController = async (req, res) => {
  const patientData = req.body
  const { id } = req.params
  const { role, id: userId, parentDoctor } = req.user

  try {

    const existingPatient = await getPatientService(id)
    const doctorId = role === 'secretary' ? parentDoctor : userId

    if (!existingPatient || String(existingPatient.user) !== String(doctorId)) {
      return res.status(404).json({ message: 'Paciente no encontrado o acceso denegado' })
    }

    const result = await updatePatientService(patientData, id)
    if(result){
      return res.status(200).json({ message: "paciente actualizado con exito "})
    }else{
      return res.status(404).json({ message: "Paciente no actualizado" })
    } 
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el paciente', error })
  }
}