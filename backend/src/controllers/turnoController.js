import {
  getTurnosService,
  addTurnoService,
  getTurnoByIdService,
  deleteTurnoService,
} from '../services/turnoServices.js'


export const turnos = async (req, res)=> {
  const { fecha } = req.query
  const { id, role, parentDoctor } = req.user
  const doctorId = role === 'secretary' ? parentDoctor : id
  try{
    const turno = await getTurnosService(doctorId, fecha)
    res.status(200).json(turno)

  }catch (error) {
    res.status(500).json({ message: 'Error al obtener turnos' })
  }
}

export const addTurno = async (req, res) => {
  const { fecha, hora, patient } = req.body
  const { id, role, parentDoctor } = req.user
  const doctorId = role === 'secretary' ? parentDoctor : id
  try{
    const result = await addTurnoService(fecha, hora, patient, doctorId)

    if(!result){
      res.status(400).json({message: 'no se pudo registrar turnos'})
    }
    res.status(200).json({ message: 'Turno registrado con éxito', turno: result })
  }catch (error){
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const deleteTurno = async (req, res) => {
  const { turnoID } = req.params
  const { id: userID, role: userRole, parentDoctor } = req.user

  try {
    const turno = await getTurnoByIdService(turnoID)

    if (!turno) {
      return res.status(404).json({ message: 'Turno no encontrado' })
    }

    const doctorId = userRole === 'secretary' ? parentDoctor : userID

    if (String(turno.paciente.user) !== String(doctorId)) {
      return res.status(403).json({ message: 'No tiene permiso para eliminar este turno' })
    }

    await deleteTurnoService(turnoID)

    res.status(200).json({ message: 'Turno eliminado con éxito' })
  } catch (error) {
    console.error('Error al eliminar turno:', error.message)
    res.status(400).json({ message: error.message || 'No se pudo eliminar el turno' })
  }
}