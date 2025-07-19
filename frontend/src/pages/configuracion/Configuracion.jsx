import { useEffect, useState } from 'react'
import './Configuracion.css'
import { Button, CircularProgress, Typography } from "@mui/material"
import { useNavigate } from 'react-router-dom'




const API_URL = import.meta.env.VITE_API_PORTALMED

function Configuracion (){
  const [secretary, setSecretary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState()
  const navigate = useNavigate()


  useEffect(() => {
    const fetchSecretary = async () => {
      try {
        const response = await fetch(`${API_URL}/api/sessions/secretary`, {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setSecretary(data)
        } else if (response.status === 404) {
          setSecretary(null) 
        } else {
          console.error('Error al consultar secretario')
        }
      } catch (error) {
        console.error('Error al obtener secretario:', error)
      } finally {
        setLoading(false)
      }
    }
        const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/sessions/islogged`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = await res.json()
        setUserData(data.user)
      } catch (err) {
        console.error('Error al obtener rol:', err)
      }
    }
    fetchUser()
    fetchSecretary()
  }, [])

  const handleAddSecretary = () => {
    navigate('/configuracion/register-secretary')
  }


  return(
    <main className="main-config">
      <h2>Configuración</h2>
      
      <section className="config-section">
        <h3 className="section-title">👤 Datos del perfil</h3>
        {userData && (
          <div>
            <p>Nombre: {userData.first_name} {userData.last_name}</p>
            <p>Email: {userData.email}</p>
          </div>
        )}
      </section>

      <section className="config-section">
        <h3 className="section-title">👥 Usuario administrativo</h3>

        <Typography variant="body2" sx={{ mb: 2 }}>
          El usuario administrativo (secretario/a) es un perfil secundario que podés crear para que te asista en la gestión diaria del consultorio.
          Este usuario podrá registrar pacientes, crear y modificar turnos, y actualizar datos personales.
          <br />
          <strong>Importante:</strong> no tendrá acceso a las evoluciones clínicas ni a la información médica registrada por el profesional.
        </Typography>
        
        {loading ? (
          <p>Cargando...</p>
        ) : secretary ? (
          <div className="secretary-info">
            <Typography variant="body1">Ya existe un usuario administrativo registrado.</Typography>
            <Typography variant="body2">
              <strong>Username:</strong> {secretary.username}
            </Typography>
            <Button variant="contained" disabled sx={{ mt: 2 }}>
              Agregar secretario/a
            </Button>
          </div>
        ) : (
          <Button 
          variant="contained" 
          onClick={handleAddSecretary}
          sx={{
            backgroundColor: '#7BD9B1',
            color: '#222',
            fontWeight: 'bold',
            marginTop: '1rem',
            '&:hover': {
              backgroundColor: '#64caa2',
              color: '#000', 
            },
          }}
          >
            Registrar usuario administrativo
          </Button>
        )}
      </section>


      <section className="config-section">
        <h3 className="section-title">🕐 Preferencias de turnos</h3>
        <p>Duración por defecto: 15 minutos</p>
        <p>Horarios disponibles: 08:00 a 21:00</p>
        {/* hacer que se puedan editar en el futuro */}
      </section>
    </main>
  )
}

export default Configuracion