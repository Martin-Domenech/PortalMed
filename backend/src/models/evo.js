import mongoose from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2"

const evoCollection = "Evos"


const evoSchema = new mongoose.Schema({
    motivo_consulta: String,
    info_consulta: String,
    patient: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
    }
    
}, { timestamps: true })

evoSchema.plugin(mongoosePaginate)
const firstCollection = mongoose.model(evoCollection, evoSchema)

export default firstCollection