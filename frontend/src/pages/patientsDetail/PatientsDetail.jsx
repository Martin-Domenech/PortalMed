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
        obre_social: '',
        birthdate: '',
        dni: '',
        gender: '',
        biologicalGender: '',
    })
    const [openEvoForm, setOpenEvoForm] = useState(false)
    const [newEvo, setNewEvo] = useState({
      motivo_consulta: '',
      info_consulta: ''
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

            if (!response.ok) throw new Error('Error al obtener el paciente')

            const data = await response.json()
            setPatient(data)
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }

    useEffect(() => {
        getPatientById()
        getEvolutionsByPatient()
    }, [id, newEvo])

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
      });
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

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(newEvo)
        })

        if (!response.ok) throw new Error('Error al guardar la evolución')

        const data = await response.json()
        console.log('Evolución guardada:', data)

        setNewEvo({ motivo_consulta: '', info_consulta: '' })
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
        if (!response.ok) throw new Error('Error al obtener evoluciones')
        const data = await response.json()
        setEvolutions(data)
      } catch (error) {
        console.error('Error al obtener evoluciones:', error)
      }
    }


    return(
        <section className="patient-detail">
            <div className="personal-info">
                <h4>Información del paciente:</h4>
                <p><span>Nombre: </span>{patient.first_name} {patient.last_name}</p>
                <p><span>Email: </span>{patient.email}</p>
                <p><span>Numero de telefono: </span>{patient.phone_number}</p>
                <p><span>DNI: </span>{patient.dni}</p>
                <p><span>Obra social: </span>{patient.obre_social}</p>
                <p><span>Fecha de nacimiento: </span>{new Date(patient.birthdate).toLocaleDateString('es-AR')}</p>
                <p><span>Genero: </span>{patient.gender}</p>
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