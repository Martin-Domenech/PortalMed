import "./UserHome.css"
import { useState, useEffect } from "react"
import TablePaginate from "../../components/tablePaginate/TablePaginate"
import CircularProgress from '@mui/material/CircularProgress'
import AlertTitle from '@mui/material/AlertTitle';
import { Alert } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import useIsMobile from "../../hooks/useIsMobile";



const API_URL = import.meta.env.VITE_API_PORTALMED
function UserHome() {

  const [patient, setPatient] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    obra_social: '',
    plan_obra_social: '',
    numero_obra_social: '',
    birthdate: '',
    dni: '',
    gender: '',
  })
  const [userRole, setUserRole] = useState("")
  const [updatePatients, setUpdatePatients] = useState(false)
  const [patients, setPatients] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const handleChange = (e) => {
    const {name, value} = e.target
    setPatient ({
        ...patient,
        [name]: value 
    })  
  }
  const isMobile = useIsMobile();
  
  const getPatients = async () => {
    try {
      setLoading(true)
      let query = `page=${page}`
      if(search) query += `&search=${search}`


      const response = await fetch(`${API_URL}/api/patients?${query}`, {
        method: 'GET',
        credentials: 'include',
        headers:{
          'Content-Type': 'application/json',
        }
      })
      if (response.status === 401) {
        window.location.href = "/login"
      }
  
      if (!response.ok) {
        throw new Error('Error al obtener los pacientes')
      }
  
      const data = await response.json() 
      setPatients(data)
  
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getPatients()
    setUpdatePatients(false) 
  }, [page, updatePatients, search])

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch(`${API_URL}/api/sessions/islogged`, {
          method: 'GET',
          credentials: 'include'
        })
        if (!res.ok) throw new Error("No autenticado")
        const data = await res.json()
        setUserRole(data.user.role)
      } catch (err) {
        console.error("Error al obtener el rol", err)
      }
    }
    fetchUserRole()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {

      const sanitizedPatient = { ...patient }

      if (!sanitizedPatient.birthdate) {
        delete sanitizedPatient.birthdate;
      }

      const response = await fetch(`${API_URL}/api/patients/register`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedPatient),
        credentials: 'include',
      })
      if (response.status === 401) {
        window.location.href = "/login"
      }
      if(!response.ok) throw new Error('Error en el registro de la paciente')

      setPatient({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        obra_social: '',
        plan_obra_social: '',
        numero_obra_social: '',
        birthdate: '',
        dni: '',
        gender: '',
      })
      setUpdatePatients(true)

      setShowSuccessAlert(true)
      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)

    } catch (error) {
      throw new Error(`Error en el registro:` + error)
    }finally {
      setLoading(false)
    }
  }
  

  return (
    <div >
      {loading ? (
        <div className="loadingCircle">
          <CircularProgress  size="5rem"/>
        </div>
      ) : (
        <div className="userHome">
          {showSuccessAlert && (
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" className={`success-alert ${showSuccessAlert ? '' : 'hide'}`}>
              <AlertTitle>Registro exitoso:</AlertTitle>
              Paciente agregado/a crrectamente.
            </Alert>
          )}
          <section className="patients-table">
            <TablePaginate
              patients={patients}
              setPatients={setPatients}
              page={page}
              setPage={setPage}
              search={search}
              setSearch={setSearch}
              className="table"
              hideEmail={isMobile}
              userRole={userRole}
            />
          </section>

          <section className="formPatientRegister">
            <h4 >Agregar nuevo paciente:</h4>
            <form onSubmit={handleSubmit} className="form-patient" >

              <label htmlFor="first_name">* Nombre:</label>
              <input
                type="text"
                name="first_name"
                value={patient.first_name}
                onChange={handleChange}
                required
                autoComplete="off"
              />

              <label htmlFor="last_name">* Apellido:</label>
              <input
                type="text"
                name="last_name"
                value={patient.last_name}
                onChange={handleChange}
                required
                autoComplete="off"
              />

              <label htmlFor="dni">DNI:</label>
              <input
                type="text"
                name="dni"
                value={patient.dni}
                onChange={handleChange}
                autoComplete="off"
              />

              <label htmlFor="phone_number">Numero de telefono:</label>
              <input
                  type="tel"
                  name="phone_number"
                  value={patient.phone_number}
                  onChange={handleChange}
                  autoComplete="off"
              />

              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                value={patient.email}
                onChange={handleChange}
                autoComplete="off"
                className="email-input"
              />

              <label htmlFor="birthdate">Fecha de nacimiento:</label>
              <input
                type="date"
                name="birthdate"
                value={patient.birthdate}
                onChange={handleChange}
                autoComplete="off"
                max={new Date().toISOString().split('T')[0]}
              />

              <label htmlFor="obra_social">Obra social:</label>
              <input
                  type="text"
                  name="obra_social"
                  value={patient.obra_social}
                  onChange={handleChange}
                  autoComplete="off"
              />

              <label htmlFor="plan_obra_social">Plan de la obra social:</label>
              <input
                  type="text"
                  name="plan_obra_social"
                  value={patient.plan_obra_social}
                  onChange={handleChange}
                  autoComplete="off"
              />

              <label htmlFor="numero_obra_social">Numero de obra social:</label>
              <input
                  type="text"
                  name="numero_obra_social"
                  value={patient.numero_obra_social}
                  onChange={handleChange}
                  autoComplete="off"
              />

              <label htmlFor="gender">Género:</label>
              <select
                name="gender"
                value={patient.gender}
                onChange={handleChange}
              >
                <option value="">Seleccione</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
                <option value="otro">Otro</option>
              </select>

              <p className="campos-obligatorios">* Campos obligatorios</p>
              <button type="submit" className="btn-patient">Agregar paciente</button>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default UserHome