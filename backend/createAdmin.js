import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { createHash } from './src/utils/utils.js'
import UserModel from './src/models/user.js' // Asegurate de que esta ruta apunte a tu modelo de usuario

dotenv.config(); // Para poder usar process.env.MONGO_URL

const MONGO_URL = process.env.MONGO_URL;

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('🔌 Conectado a MongoDB');

    // Verificamos si ya existe un admin con ese username
    const existing = await UserModel.findOne({ username: 'Admin' });
    if (existing) {
      console.log('⚠️ Ya existe un usuario admin con username "admin"');
      return;
    }
    const password = "portalmedadmin01"

    const newAdmin = await UserModel.create({
      first_name: 'Admin',
      last_name: 'User',
      username: 'Admin_01',
      email: 'admin@example.com',
      password: createHash(password),
      role: 'admin'
    });

    console.log('✅ Usuario admin creado con éxito:', newAdmin);
  } catch (err) {
    console.error('❌ Error creando el admin:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();