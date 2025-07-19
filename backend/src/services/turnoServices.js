import turnoModel from '../models/turno.js'

export const getTurnosService = async (userId, fecha) => {

  const turnos = await turnoModel.find({
    user: userId,
    fecha: fecha,
  }).populate('paciente')
    .sort({ hora: 1 })

  return turnos
}


export const addTurnoService = async (fecha, hora, pacienteId, userId) => {

  const turnoExistente = await turnoModel.findOne({
    user: userId,
    fecha: fecha,
    hora: hora
  })
  if (turnoExistente) {
    throw new Error('Ya existe un turno en ese horario para este usuario')
  }
  const nuevoTurno = new turnoModel({
    fecha,
    hora,
    paciente: pacienteId,
    user: userId
  })
  const result = await nuevoTurno.save()
  return result
}


export const getTurnoByIdService = async (turnoID) => {
  return await turnoModel.findById(turnoID).populate('paciente')
}

export const deleteTurnoService = async (turnoID) => {
  return await turnoModel.findByIdAndDelete(turnoID)
}

export const deleteTurnosByPatientId = async (patientID) => {
  return await turnoModel.deleteMany({ patient: patientID })
}