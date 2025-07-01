import './Register.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_PORTALMED
function Register() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        age: '',
        password: '',
        role: 'user',
    })
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            const response = await fetch(`${API_URL}/api/sessions/register`, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            if (response.status === 401) {
                window.location.href = "/login"
            }

            if(!response.ok){
                const errorMessage = await response.text()
                throw new Error(`Error en el registro: ${errorMessage}`);
            }

            navigate('/')

        } catch (error){
            console.error('Error:', error);
        }
    }

    return (
        <div className="register">
            <h2>Nuevo Usuario</h2>
            <form onSubmit={handleSubmit} className='form'>
                <label htmlFor="first_name">Nombre:</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required autoComplete="off"/>
                
                <label htmlFor="last_name">Apellido:</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required autoComplete="off"/>
                
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required autoComplete="off"/>

                <label htmlFor="email">Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="off"/>
                
                <label htmlFor="password">Contraseña:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required autoComplete="new-password"/>
                
                <label htmlFor="role">Rol:</label>
                <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                
                <button type="submit">Agregar</button>
            </form>
        </div>
    );
}

export default Register