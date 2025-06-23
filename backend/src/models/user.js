import mongoose from 'mongoose'

const userCollection = "Users"


const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true },
    age: Number,
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    patients: {
        type: [
            {
                patient:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref: "Patients"
                }
            }
        ], default: []
    }
})

const firstCollection = mongoose.model(userCollection, userSchema)

export default firstCollection