import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import { 
  registerUser,
  loginUser,
  createSecretaryService, 
  getSecretaryByDoctorId,
} from '../services/userServices.js'


export const register = async (req, res) => {
  try {
    const userData = req.body
    const result = await registerUser(userData)
    if (result.error) return res.status(400).json({ message: result.error })
    res.status(201).json({ message: 'Usuario creado con éxito' })
  } catch (error) {
    console.error('Error al crear el usuario:', error)
    res.status(500).send(`Error al crear el usuario: ${error.message}`)
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userData = await loginUser(username, password);
    if (userData.error) return res.status(401).json({ message: 'credenciales incorrectas' })

    const { _id, first_name, last_name, role, parentDoctor, email } = userData
    const payload = {
      id: _id,
      first_name,
      last_name,
      role,
      email,
    }

    if (role === 'secretary' && parentDoctor) {
      payload.parentDoctor = parentDoctor
    }

    const token = jwt.sign(payload, config.secret_key, { expiresIn: "24h" })
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: config.node_env === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.json({ message: 'Autenticado correctamente' })
  } catch (error) {
    console.error('Error en el login:', error)
    res.status(401).json({ message: 'Credenciales incorrectas' })
  }
}

export const logout = (req, res) => {
  try{
    res.clearCookie('authToken')
    res.status(200).send({ message: 'Logout exitoso' })
  } catch(error){
    console.error(error)
    res.status(500).send({ message: 'Error al cerrar sesión' });
  }   
}

export const isLogged = (req, res) => {
  const user = req.user

  if (!user) {
    return res.status(401).json({ message: 'Usuario no autenticado' })
  }

  res.status(200).json({
    message: 'Usuario autenticado',
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    }
  })
} 


export const registerSecretary = async (req, res) => {
  try {
    const doctorId = req.user.id
    const secretaryData = req.body

    const newSecretary = await createSecretaryService(secretaryData, doctorId)

    res.status(201).json({
      message: 'Secretario/a registrado/a con éxito',
      user: {
        id: newSecretary._id,
        username: newSecretary.username,
        role: newSecretary.role,
        parentDoctor: newSecretary.parentDoctor
      }
    })
  } catch (error) {
    console.error('Error al registrar secretario/a:', error)
    res.status(500).json({ message: error.message || 'Error al registrar secretario/a' })
  }
}


export const getSecretary = async (req, res) => {
  try {
    const doctorId = req.user.id
    const secretary = await getSecretaryByDoctorId(doctorId)

    if (!secretary) {
      return res.status(404).json({ message: 'No hay secretario registrado' })
    }

    res.status(200).json(secretary)
  } catch (error) {
    console.error('Error al obtener secretario:', error)
    res.status(500).json({ message: 'Error al obtener secretario' })
  }
}