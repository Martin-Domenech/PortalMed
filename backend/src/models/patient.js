import mongoose from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2"

const patientCollection = "Patients"


const patientSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String },
    phone_number: String,
    obra_social: String,
    plan_obra_social: String,
    numero_obra_social: String,
    birthdate: Date,
    dni: String,
    gender: { type: String, enum: ['', 'hombre', 'mujer', 'otro']},
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }
    
})

patientSchema.plugin(mongoosePaginate)
const firstCollection = mongoose.model(patientCollection, patientSchema)

export default firstCollection