import "./UserHome.css"
import { useState, useEffect } from "react"
import TablePaginate from "../../components/tablePaginate/TablePaginate"
import CircularProgress from '@mui/material/CircularProgress'
import AlertTitle from '@mui/material/AlertTitle';
import { Alert } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';



const API_URL = import.meta.env.VITE_API_PORTALMED
function UserHome() {

  const [patient, setPatient] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    obre_social: '',
    birthdate: '',
    dni: '',
    gender: '',
  })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/patients/register`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(patient),
        credentials: 'include',
      })
      if(!response.ok) throw new Error('Error en el registro de la paciente')

      console.log('registro de paciente exitoso')

      setPatient({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        obre_social: '',
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
                required
                autoComplete="off"
              />

              <label htmlFor="phone_number">Numero de telefono:</label>
              <input
                  type="phone_number"
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