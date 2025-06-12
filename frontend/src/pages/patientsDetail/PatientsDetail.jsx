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

    const handleClickOpen = (id) => {
        setOpen(true)
      }
      const handleClose = () => {
        setOpen(false)
      }


    const getPatientById = async () => {
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:8080/api/patients/${id}`, {
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
    }, [id])

    const updatePatient =  (id) => {
        navigate(`/update-patient/${id}`)
    }

    const deletePatient = async () => {
    try {
        const response = await fetch(`http://localhost:8080/api/patients/delete/${id}`, {
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


    return(
        <section className="patient-detail">
            <div className="personal-info">
                <h4>Datos de paciente:</h4>
                <p><span>Nombre: </span>{patient.first_name} {patient.last_name}</p>
                <p><span>Email: </span>{patient.email}</p>
                <p><span>Numero de telefono: </span>{patient.phone_number}</p>
                <p><span>DNI: </span>{patient.dni}</p>
                <p><span>Obra social: </span>{patient.obre_social}</p>
                <p><span>Fecha de nacimiento: </span>{patient.birthdate}</p>
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
            <div>
            <h1>hoalaslkjndkabsfdihabsdijfkhbsjlhdfbsd</h1>
            <p>sdkjfbujshdgvbfkujsahbdf</p>
            </div>
        </section>
    )
}

export default PatientsDetail