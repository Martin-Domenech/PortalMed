import mongoose from 'mongoose'

const turnoCollection = "Turnos"

const turnoSchema = new mongoose.Schema({
  fecha: {
    type: String,
    required: true
  },
  hora: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
  },
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patients',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }
}, {
  timestamps: true
})

const TurnoModel = mongoose.model(turnoCollection, turnoSchema)

export default TurnoModel