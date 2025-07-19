import "./PatientsDetail.css"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import CircularProgress from '@mui/material/CircularProgress'
import AlertTitle from '@mui/material/AlertTitle';
import { Alert } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from "@mui/material";

const API_URL = import.meta.env.VITE_API_PORTALMED

const renderArchivo = (url) => {
  const ext = url.split('.').pop().toLowerCase()

  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img
          src={url}
          alt="archivo"
          style={{
            height: '150px',
            width: 'auto',
            objectFit: 'cover',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        />
      </a>
    )
  }

  if (ext === 'pdf') {
    const fileName = decodeURIComponent(url.split('/').pop().replace(/^[0-9]+-/, ''))
    return (  
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem' }}>
       📄 {fileName}
      </a>
    )
  }

  const fileName = url.split('/').pop()
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem' }}>
      📎 {fileName}
    </a>
  )
}


function PatientsDetail () {
    const navigate = useNavigate()
    const {id} = useParams()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
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
    const [openEvoForm, setOpenEvoForm] = useState(false)
    const [newEvo, setNewEvo] = useState({
      motivo_consulta: '',
      info_consulta: '',
      archivos: null,
    })
    const [evolutions, setEvolutions] = useState([])
    const [openDeleteEvo, setOpenDeleteEvo] = useState(false)
    const [evoToDelete, setEvoToDelete] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [evoBeingEdited, setEvoBeingEdited] = useState(null)  

    const handleClickOpen = (id) => {
      setOpen(true)
    }
    const handleClose = () => {
      setOpen(false)
    }
    const handleOpenEvoForm = (evo = null) => {
      if (evo) {
        setIsEditing(true)
        setEvoBeingEdited(evo._id)
        setNewEvo({
          motivo_consulta: evo.motivo_consulta || '',
          info_consulta: evo.info_consulta || ''
        })
      } else {
        setIsEditing(false)
        setEvoBeingEdited(null)
        setNewEvo({
          motivo_consulta: '',
          info_consulta: ''
        })
      }
    setOpenEvoForm(true)
    }
    const handleCloseEvoForm = () => setOpenEvoForm(false)

    const handleOpenDeleteEvo = (evoId) => {
      setEvoToDelete(evoId)
      setOpenDeleteEvo(true)
    }

    const handleCloseDeleteEvo = () => {
      setEvoToDelete(null)
      setOpenDeleteEvo(false)
    }

    const handleChangeEvo = (e) => {
      setNewEvo({
        ...newEvo,
        [e.target.name]: e.target.value
      })
    }

    useEffect(() => {
        getPatientById()
        getEvolutionsByPatient()
    }, [id, newEvo])

    const getPatientById = async () => {
        setLoading(true)
        try {
          const response = await fetch(`${API_URL}/api/patients/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
          },
          })
          if (response.status === 401) {
            window.location.href = "/login"
          }
          if (!response.ok) throw new Error('Error al obtener el paciente')

          const data = await response.json()
          setPatient(data)
        } catch (error) {
          console.error('Error:', error)
        } finally {
          setLoading(false)
        }
    }

    const updatePatient =  (id) => {
        navigate(`/update-patient/${id}`)
    }

    const deletePatient = async () => {
    try {
      const response = await fetch(`${API_URL}/api/patients/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      if (response.status === 401) {
        window.location.href = "/login";
      }
      if (!response.ok) {
        const errorMessage = await response.json(); 
        throw new Error(`Error: ${errorMessage}`);
      }
      } catch (error) {
          console.error(error);
      } finally {
          setOpen(false);
          navigate('/')
      }
    }
    const deleteEvo = async(evoId) => {
      try{
        const response = await fetch(`${API_URL}/api/evos/delete/${evoId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        if (response.status === 401) {
          window.location.href = "/login";
        }
        if(!response.ok){
          const errorMessage = await response.json(); 
          throw new Error(`Error: ${errorMessage}`);
        }
        getEvolutionsByPatient()
      }catch(error){
        console.error(error);
      }
    }
    
    const submitEvo = async (e) => {
      e.preventDefault()
      try {
        const url = isEditing
          ? `${API_URL}/api/evos/update/${evoBeingEdited}`
          : `${API_URL}/api/evos/register/${id}`

        const method = isEditing ? 'PUT' : 'POST'

        const formData = new FormData()
        formData.append('motivo_consulta', newEvo.motivo_consulta)
        formData.append('info_consulta', newEvo.info_consulta)

        if (newEvo.archivos) {
          for (let i = 0; i < newEvo.archivos.length; i++) {
            formData.append('archivos', newEvo.archivos[i])
        }
    }

        const response = await fetch(url, {
          method,
          credentials: 'include',
          body: formData,
        })  
        if (response.status === 401) {
          window.location.href = "/login"
        }

        if (!response.ok) throw new Error('Error al guardar la evolución')

        const data = await response.json()
        console.log('Evolución guardada:', data)

        setNewEvo({ motivo_consulta: '', info_consulta: '', archivos: null })
        setIsEditing(false)
        setEvoBeingEdited(null)
        setOpenEvoForm(false)
        getEvolutionsByPatient()

      } catch (error) {
        console.error(error)
      }
    }

    const getEvolutionsByPatient = async () => {
      try {
        const response = await fetch(`${API_URL}/api/evos/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (response.status === 401) {
          window.location.href = "/login"
        }
        if (!response.ok) throw new Error('Error al obtener evoluciones')
        const data = await response.json()
        setEvolutions(data)
      } catch (error) {
        console.error('Error al obtener evoluciones:', error)
      }
    }

    function ageCalc(fechaNacimiento) {
      const hoy = new Date()
      const nacimiento = new Date(fechaNacimiento)
      if (isNaN(nacimiento)) return null
      let edad = hoy.getFullYear() - nacimiento.getFullYear()
      const mes = hoy.getMonth() - nacimiento.getMonth()

      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--
      }

      return edad
    }
    
    return(
        <section className="patient-detail">
            <div className="personal-info">
                <h4>Información Personal:</h4>
                <p><span>Nombre: </span>{patient.first_name} {patient.last_name}</p>
                <p><span>Genero: </span>{patient.gender}</p>
                <p><span>Edad: </span>{ageCalc(patient.birthdate) !== null ? `${ageCalc(patient.birthdate)} años` : "-"}</p>
                <p><span>Email: </span>{patient.email}</p>
                <p><span>Numero de telefono: </span>{patient.phone_number}</p>
                <p><span>DNI: </span>{patient.dni}</p>
                <p><span>Obra social: </span>{patient.obra_social}</p>
                <p><span>Plan de obra social: </span>{patient.plan_obra_social}</p>
                <p><span>Numero de obra social: </span>{patient.numero_obra_social}</p>
                <p><span>Fecha de nacimiento: </span>{new Date(patient.birthdate).toLocaleDateString('es-AR')}</p>
                <div className="btns-container">
                    <button onClick={() => updatePatient(id)}>Editar <EditIcon sx={{fontSize: '1.1rem' }}/></button>
                    <button onClick={() => handleClickOpen(id)}>Eliminar <DeleteForeverIcon sx={{fontSize: '1.1rem' }}/></button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        TransitionProps={{
                          onEntering: () => {
                            setTimeout(() => {
                              const dialog = document.querySelector('[role="dialog"]')
                              if (dialog) {
                                dialog.removeAttribute('aria-hidden') 
                                dialog.focus(); 
                              }
                            }, 200)
                          }
                        }}
                      >
                        <DialogTitle id="alert-dialog-title">
                          {`Seguro que desea eliminar al paciente?`}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Si elimina este paciente, se perderán todos sus datos personales y sus evoluciones clínicas.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button 
                            onClick={handleClose} 
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
                            onClick={deletePatient} 
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
                </div>
            </div>
            <div className="cont-evoluciones">
              <Dialog open={openEvoForm} onClose={handleCloseEvoForm}>
                <DialogTitle>
                  {isEditing ? 'Editar evolución médica' : 'Nueva evolución médica'}
                </DialogTitle>
                <DialogContent>
                  <form onSubmit={submitEvo}>
                    <label>Motivo de consulta:</label>
                    <input
                      name="motivo_consulta"
                      className="motivo_consulta"
                      value={newEvo.motivo_consulta}
                      onChange={handleChangeEvo}
                      required
                      style={{ width: '100%', marginBottom: '1rem' }}
                    />
                    <label>Información adicional:</label>
                    <textarea
                      name="info_consulta"
                      className="info_consulta"
                      value={newEvo.info_consulta}
                      onChange={handleChangeEvo}
                      required
                      style={{ width: '100%', marginBottom: '1rem' }}
                    />
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                      Adjuntar archivos o imágenes:
                    </label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                      <input
                        type="file"
                        name="archivos"
                        multiple
                        onChange={(e) => setNewEvo({ ...newEvo, archivos: e.target.files })}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            width: 'fit-content',
                            cursor: 'pointer'
                          }}
                      />


                      {newEvo.archivos && newEvo.archivos.length > 5 && (
                        <span style={{ color: 'red', fontSize: '0.85rem' }}>
                          ⚠️ Máximo permitido: 5 archivos
                        </span>
                      )}
                    </div>
                    <DialogActions>
                      <Button onClick={handleCloseEvoForm}>Cancelar</Button>
                      <Button type="submit" variant="contained">Aceptar</Button>
                    </DialogActions>
                  </form>
                </DialogContent>
              </Dialog>
              <h4>Evoluciones del paciente:</h4>
              <section className="evoluciones">
                {evolutions.length === 0 ? (
                  <p>No hay evoluciones registradas.</p>
                ) : (
                  evolutions.map((evo) => (
                    <div key={evo._id} className="evo-card">
                      <p><strong>Motivo de consulta:</strong> {evo.motivo_consulta}</p>
                      <p><strong>Información:</strong> {evo.info_consulta}</p>

                      {evo.archivos && evo.archivos.length > 0 && (
                        <div style={{ marginTop: '30px' }}>
                          <p><strong>Archivos adjuntos:</strong></p>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px', alignItems: 'center' }}>
                            {evo.archivos.map((archivoUrl, index) => (
                              <div
                                key={index}
                              >
                                {renderArchivo(archivoUrl)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="end-card">
                        <p className="fecha"> {new Date(evo.createdAt).toLocaleString()}</p>
                        <div className="crud-btns">
                          <button onClick={() => handleOpenEvoForm(evo)} className="update">
                            <EditIcon sx={{ fontSize: '1.1rem' }} />
                          </button>
                          <button onClick={() => handleOpenDeleteEvo(evo._id)} className="delete">
                            <DeleteForeverIcon sx={{ fontSize: '1.1rem' }} />
                          </button>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))
                )}
              </section>
              <Dialog
                open={openDeleteEvo}
                onClose={handleCloseDeleteEvo}
              >
                <DialogTitle>¿Eliminar evolución?</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Esta acción eliminará la evolución seleccionada de forma permanente.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDeleteEvo}>Cancelar</Button>
                  <Button
                    onClick={() => {
                      deleteEvo(evoToDelete)
                      handleCloseDeleteEvo()
                    }}
                    variant="contained"
                    color="error"
                  >
                    Eliminar
                  </Button>
                </DialogActions>
              </Dialog>
              <Button
                className="nueva-evo-btn"
                onClick={() => handleOpenEvoForm()}
              >
                Nueva evolución
              </Button>
              
            </div>
        </section>
    )
}

export default PatientsDetail