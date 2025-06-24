import React, { useEffect, useState } from "react"
import './UpdatePatient.css'
import { useNavigate, useParams } from "react-router-dom"
import { CircularProgress } from "@mui/material"

const API_URL = import.meta.env.VITE_API_PORTALMED
function UpdatePatient () {
    const navigate = useNavigate()
    const {id} = useParams()
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
    const [loading, setLoading] = useState(false)

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
    }, [id])

    const handleChange = (e) => {
        const {name, value} = e.target
        setPatient ({
            ...patient,
            [name]: value 
        })  
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
          const response = await fetch(`${API_URL}/api/patients/update/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(patient),
            credentials: 'include',
          })
          if (!response.ok) throw new Error('Error al actualizar el paciente')
          
          console.log('Paciente actualizado exitosamente')
          navigate(-1)
        } catch (error) {
          console.error('Error:', error)
        } finally {
          setLoading(false);
        }
      }

    return (
        <div className="form-container">
        
            <section className="form-update-patient">
            {loading ? (
                <div className="loadingCircle">
                    <CircularProgress size="5rem" />
                </div>
                ) : (
                    <div>
                        <h4 >Modificar datos del paciente:</h4>
                        <form onSubmit={handleUpdate} className="form-patient" >
            
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
                        <button type="submit" className="btn-patient">Modificar datos del paciente</button>
                        </form>
                    </div>
            )}
            </section>
        </div>
    )
} 

export default UpdatePatient