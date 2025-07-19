import "./Turnos.css"
import { useState, useEffect, useRef } from "react"
import 'dayjs/locale/es'
import dayjs from 'dayjs'
import SearchIcon from '@mui/icons-material/Search'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Divider } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import CheckIcon from '@mui/icons-material/Check'
import AlertTitle from '@mui/material/AlertTitle'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from "@mui/material/Button"
import { useNavigate } from "react-router-dom"
import { Alert, Autocomplete, TextField, Box, Typography } from "@mui/material"
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer
} from '@mui/material'

const API_URL = import.meta.env.VITE_API_PORTALMED

function Turno () {
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Estados del turno:
  const [fecha, setFecha] = useState(dayjs())
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [horaTurno, setHoraTurno] = useState("")

  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [autocompleteOpen, setAutocompleteOpen] = useState(false)
  const [showTurnoSuccess, setShowTurnoSuccess] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
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
  const [refreshTurnos, setRefreshTurnos] = useState(false) 
  const [horariosOcupados, setHorariosOcupados] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [turnoToDelete, setTurnoToDelete] = useState(null)
  const [userRole, setUserRole] = useState("")


  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await fetch(`${API_URL}/api/turnos?fecha=${fecha.format('YYYY-MM-DD')}`, {
          credentials: 'include'
        })
        if (!response.ok) throw new Error('Error al obtener los turnos')
        const data = await response.json()
        setTurnos(data)

        const horariosTomados = data.map(turno => turno.hora)
        setHorariosOcupados(horariosTomados)
      } catch (error) {
        console.error('Error al cargar turnos:', error)
        setTurnos([])
        setHorariosOcupados([])
      }
    }

    fetchTurnos()
  }, [fecha, refreshTurnos])

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleChange = (e) => {
    const {name, value} = e.target
    setPatient ({
        ...patient,
        [name]: value 
    })  
  }

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

      console.log('registro de paciente exitoso')

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
      setRefreshTurnos(prev => !prev)

      setShowSuccessAlert(true)
      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 5000)

    } catch (error) {
      throw new Error(`Error en el registro:` + error)
    }finally {
      setLoading(false)
    }
  }

  const addTurno = async (e) => {
    e.preventDefault()

    if (!horaTurno || !selectedPatient) {
      alert("Seleccioná un horario y un paciente antes de registrar el turno.")
      return
    }

    try{
      const response = await fetch(`${API_URL}/api/turnos/addturno`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hora: horaTurno,
          patient: selectedPatient._id,
          fecha: fecha.format('YYYY-MM-DD') 
        }),
        credentials: 'include',
      })
      if (response.status === 401) {
        window.location.href = "/login"
      }
      if(!response.ok) throw new Error('Error en el registro del turno')

      console.log('registro de turno exitoso')
      setRefreshTurnos(prev => !prev)
      setSearchTerm('')
      setSelectedPatient(null)
      setHoraTurno('')
      setShowTurnoSuccess(true)
      setTimeout(() => setShowTurnoSuccess(false), 5000)
    }catch(error){
      throw new Error(`Error en el registro:` + error)
    }
  }

  const searchPatients = async () => {
    if (!searchTerm.trim()) return
    setLoadingPatients(true)

    try {
      const response = await fetch(`${API_URL}/api/patients?search=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Error al buscar pacientes')

      const data = await response.json()
      const result = Array.isArray(data?.docs) ? data.docs : []
      setSearchResults(result)
      setHasSearched(true)

      setAutocompleteOpen(true)
      inputRef.current?.focus()
    } catch (error) {
      console.error('Error en búsqueda:', error)
    } finally {
      setLoadingPatients(false)
      inputRef.current?.focus()
    }
  }

  const deleteTurno = async (turnoID) => {
    try {
      const response = await fetch(`${API_URL}/api/turnos/delete/${turnoToDelete}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) throw new Error('Error al eliminar turno')

      const data = await response.json()
      setRefreshTurnos(prev => !prev)
      console.log('Turno eliminado correctamente:', data.message)
      handleCloseDialog()
    } catch (error) {
      console.error('Error al eliminar el turno:', error)
    }
  }

  const handleOpenDialog = (turnoId) => {
    setTurnoToDelete(turnoId)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setTurnoToDelete(null)
  }

  const generarHorarios = () => {
    const horarios = []
    const start = 8 * 60 // 8:00 
    const end = 21 * 60 // 21:00

    for (let mins = start; mins < end; mins += 15) {
      const horas = String(Math.floor(mins / 60)).padStart(2, '0')
      const minutos = String(mins % 60).padStart(2, '0')
      horarios.push(`${horas}:${minutos}`)
    }

    return horarios
  }
  const horarios = generarHorarios()

  const handleClickDetail = (id) => {
    navigate(`/patient-detail/${id}`)
  }

  const rangoTurnos = (horaStr) => {
    const [hora, minuto] = horaStr.split(':').map(Number)
    return dayjs().hour(hora).minute(minuto).add(15, 'minute').format('HH:mm')
  }
  const turnosValidos = turnos.filter(t => t.paciente && t.paciente.first_name)
  return(
    <section>
      {showSuccessAlert && (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" className="alert-fixed">
          <AlertTitle>Registro exitoso:</AlertTitle>
          Paciente agregado/a correctamente.
        </Alert>
      )}
      {showTurnoSuccess && (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" className="alert-fixed">
          <AlertTitle>Turno registrado</AlertTitle>
          El turno fue agregado correctamente.
        </Alert>
      )}
      {loading ? (
          <div className="loadingCircle">
            <CircularProgress  size="5rem"/>
          </div>
        ) : (
        <main className="cont-principal">
          <section className="turnos-secction">
            <div className="calendario-addTurno">
              <div className="calendario">
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DateCalendar
                    value={fecha}
                    onChange={(newValue) => setFecha(newValue)}
                    sx={{
                      backgroundColor: '#fff',
                      color: '#333',
                      borderRadius: '10px',
                      padding: '10px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                      '.MuiPickersDay-root': {
                        color: '#333',
                      },
                      '.MuiTypography-root': {
                        color: '#333',
                      },
                      '.MuiPickersCalendarHeader-label': {
                        color: '#333',
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
              <Divider orientation="vertical" flexItem />
              <div className="nuevo-turno">  
                <h3>Registrar nuevo turno </h3>  
                <form onSubmit={addTurno} className="turno-form">

                  <p>Fecha: {fecha.format('DD/MM/YYYY')}</p>
                  
                  <div className="input-patient">
                    <label htmlFor="horario-turno">Seleccionar Paciente</label>
                    <Autocomplete
                      freeSolo
                      options={searchResults}
                      disableClearable
                      open={autocompleteOpen || (hasSearched && searchResults.length === 0)}
                      onOpen={() => setAutocompleteOpen(true)}
                      onClose={() => setAutocompleteOpen(false)}
                      inputValue={searchTerm}
                      onInputChange={(e, value, reason) => {
                        if (reason === 'input') {
                          setSearchTerm(value)
                          if (value.trim() === '') {
                            setHasSearched(false)
                            setSearchResults([])
                          }
                        }
                        if (reason === 'clear') {
                          setSearchTerm('')
                          setHasSearched(false)
                          setSearchResults([])
                          setSelectedPatient(null)
                        }
                      }}
                      getOptionLabel={(option) => {
                        if (typeof option === 'string') return option
                        if (!option || !option.first_name) return ''
                        return `${option.first_name} ${option.last_name}`
                      }}
                      noOptionsText={hasSearched && !loadingPatients ? "Sin resultados" : ""}
                      onChange={(e, value) => {
                        if (value && typeof value !== 'string') {
                          setSelectedPatient(value)
                          setSearchTerm(`${value.first_name} ${value.last_name}`)
                        } else {
                          setSelectedPatient(null)
                        }
                        setHasSearched(false)
                        setAutocompleteOpen(false)
                      }}
                      loading={loadingPatients}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Buscar paciente"
                          placeholder="Nombre, apellido"
                          inputRef={inputRef}
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '40px',
                              fontSize: '0.85rem',
                              alignItems: 'center',
                            },
                            '& .MuiInputBase-input': {
                              padding: '0 12px',
                              height: '100%',
                              boxSizing: 'border-box',
                              display: 'flex',
                              alignItems: 'center',
                            },
                            '& .MuiInputLabel-root': {
                              top: '-6px', 
                              fontSize: '0.75rem',
                            },
                            '& .MuiInputLabel-shrink': {
                              top: '0px', 
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              searchPatients()
                            }
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <Box
                              onClick={searchPatients}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                color: 'gray',
                                marginRight: '8px',
                                '&:hover': {
                                  color: '#1E1E1E',
                                }
                              }}
                            >
                              <SearchIcon />
                            </Box>
                            )
                          }}
                        />
                      )}
                      sx={{ width: '100%' }}
                    />  
                    <div>
                      {hasSearched && searchResults.length === 0 && !loadingPatients && (
                        <Typography color="error" variant="body2" sx={{ ml: 1 }}>
                          * No se encontró ningún paciente.
                        </Typography>
                      )}
                    </div>
                  </div>

                  <div className="input-horario">
                    <label htmlFor="horario-turno">Seleccionar horario</label>
                    <select value={horaTurno} onChange={(e) => setHoraTurno(e.target.value)} className="select-horario" id="horario-turno">
                      <option value="">Seleccionar horario</option>
                      {horarios.map((hora, index) => (
                        <option key={index} value={hora} disabled={horariosOcupados.includes(hora)}>
                          {hora}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="Btn-nuevo-turno">Nuevo Turno</button>

                </form>
              </div>

              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'block'
                  }
                }}
              />

              {!isMobile && (
                <div>
                  <div className="resumen-turnos">
                    <h3>
                      Información del {fecha.format('DD/MM/YYYY')}
                    </h3>
                    <p>
                      - Total de turnos: {turnos.length}
                    </p>
                    <p>
                      {turnos.length > 0
                        ? `- Rango horario: ${turnos[0].hora} a ${rangoTurnos(turnos[turnos.length - 1].hora)}`
                        : '- No hay turnos en este día.'}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {turnos.length === 0 ? (
              <div className="tabla-turnos no-turnos">
                <h3>No hay turnos cargados en esta fecha.</h3>
              </div>
            ) : (
              <TableContainer component={Paper}  className="tabla-turnos">
                <Table stickyHeader sx={{ width: '100%' }}>
                  <TableHead>
                    <TableRow >
                      <TableCell className="bg-green celda-con-separador"><strong>Hora</strong></TableCell>
                      <TableCell className="bg-green celda-con-separador"><strong>Paciente</strong></TableCell>
                      <TableCell className="bg-green celda-con-separador"><strong>Telefono</strong></TableCell>
                      {!isMobile && <TableCell className="bg-green"><strong>Obra social</strong></TableCell>}
                      <TableCell className="bg-green "></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {turnosValidos.map((turno, index) => (
                      <TableRow
                        key={turno._id}
                        sx={{
                          backgroundColor: index % 2 === 0 ?  '#ffffffff' : '#e3ffe9ff'
                        }}
                      >
                        <TableCell><strong>{turno.hora}</strong></TableCell>
                        <TableCell component="th" scope="row" sx={{ fontSize: '0.95rem' }}>
                          {userRole !== 'secretary' ? (
                            <Typography
                              onClick={() => handleClickDetail(turno.paciente._id)}
                              className="nombre-paciente"
                              sx={{
                                cursor: 'pointer',
                                color: 'black',
                                fontWeight: 'bold',
                                '&:hover': {
                                  color: 'blue',
                                },
                              }}
                            >
                              {turno.paciente.first_name} {turno.paciente.last_name}
                            </Typography>
                          ) : (
                            <Typography sx={{ color: 'black', fontWeight: 'bold' }}>
                              {turno.paciente.first_name} {turno.paciente.last_name}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{turno.paciente.phone_number || '-'}</TableCell>
                        {!isMobile && (
                          <TableCell>{turno.paciente.obra_social || '-'}</TableCell>
                        )}
                        <TableCell sx={{ display: 'flex', justifyContent: 'end', paddingRight: '10px'}}>
                          <DeleteForeverIcon
                            fontSize={isMobile ? 'small' : 'medium'}
                            onClick={() => handleOpenDialog(turno._id)}
                            sx={{ cursor: 'pointer', color: '#292929ff' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </section>
          <section className="formPatientRegisterTurnos">
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
        </main>
        )}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          TransitionProps={{
            onEntering: () => {
              setTimeout(() => {
                const dialog = document.querySelector('[role="dialog"]')
                if (dialog) {
                  dialog.removeAttribute('aria-hidden')
                  dialog.focus()
                }
              }, 200)
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">
            {`¿Seguro que desea eliminar el turno?`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Esta acción eliminará el turno seleccionado de forma permanente.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{
                color: 'gray',
                borderColor: 'gray',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  borderColor: 'gray',
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={deleteTurno}
              variant="contained"
              autoFocus
              sx={{
                backgroundColor: '#d32f2f',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                }
              }}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </section>
  )
}

export default Turno