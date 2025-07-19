import './RegisterSecretary.css'
import CheckIcon from '@mui/icons-material/Check'
import { Alert, AlertTitle } from "@mui/material"
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';



const API_URL = import.meta.env.VITE_API_PORTALMED

function RegisterSecretary () {
  const [passwordError, setPasswordError] = useState('')
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false)
  const [secretary, setSecretary] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    passwordRepited: '',
  })
  const navigate = useNavigate();

  useEffect(() => {
    setSecretary({
      first_name: '',
      last_name: '',
      username: '',
      password: '',
      passwordRepited: '',
    })
  }, [showRegisterSuccess])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (secretary.password !== secretary.passwordRepited) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    setPasswordError('')
    const { passwordRepited, ...dataToSend } = secretary
    try{
      const response = await fetch(`${API_URL}/api/sessions/register-secretary`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      })

      if(!response.ok){
        const errorMessage = await response.text()
      throw new Error(`Error en el registro: ${errorMessage}`)
      }
      setShowRegisterSuccess(true)
      setTimeout(() => {
        setShowRegisterSuccess(false)
        navigate('/configuracion')
      }, 3000)
    } catch (error){
      console.error('Error:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSecretary({
      ...secretary,
      [name]: value,
    })
  }


  return(
    <section className='register-secretary'>
      {showRegisterSuccess && (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" className="alert-fixed">
          <AlertTitle>Secretario/a registrado</AlertTitle>
          El usuario fue registrado correctamente.
        </Alert>
      )}
        
        <form onSubmit={handleSubmit} className='form' autoComplete="off">
          <h3 className='title-form'>Registrar Usuario Administrativo</h3>
          <label htmlFor="first_name">Nombre:</label>
          <input type="text" name="first_name" value={secretary.first_name} onChange={handleChange} required autoComplete="off"/>
          
          <label htmlFor="last_name">Apellido:</label>
          <input type="text" name="last_name" value={secretary.last_name} onChange={handleChange} required autoComplete="off"/>
          
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" value={secretary.username} onChange={handleChange} required autoComplete="new-username"/>

          <label htmlFor="password">Contraseña:</label>
          <input type="password" name="password" value={secretary.password} onChange={handleChange} required autoComplete="new-password"/>

          <label htmlFor="repited-password">Repetir contraseña:</label>
          <input type="password" name="passwordRepited" value={secretary.passwordRepited} onChange={handleChange} required autoComplete="off"/>
          {passwordError && (
            <p style={{ color: 'red', marginTop: '0.5rem' }}>{passwordError}</p>
            
          )}
            <button type="submit">Agregar</button>
        </form>
    </section>
  )
}

export default RegisterSecretary