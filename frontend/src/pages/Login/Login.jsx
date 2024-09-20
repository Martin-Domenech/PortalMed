import './Login.css'
import { useState } from 'react' 
import { useNavigate } from 'react-router-dom';

function Login () {

    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target
        setUser ({
            ...user,
            [name]: value 
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:8080/api/sessions/login', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
                credentials: 'include',
            })
            const data = response
            if(!response.ok){
                const errorMessage = await response.text()
                throw new Error(`Error en el registro: ${errorMessage}`);
            }
            console.log(`Login exitoso: ${data}`)
            navigate('./')

        } catch (error) {
            console.error('Error:', error);
        }
    }


    return(

        <div className="login">
            <h2>Iniciar sesión:</h2>
            <form onSubmit={handleSubmit} className='form'>
                <label htmlFor="email">Ingrese su correo electrónico:</label>
                <input type="text" name="email" value={user.email} onChange={handleChange} required autoComplete="off"/>
                
                <label htmlFor="password">Contraseña:</label>
                <input type="password" name="password" value={user.password} onChange={handleChange} required autoComplete="new-password"/>
                
                <button type="submit">Iniciar sesión</button>
            </form>
        </div>
    )
}

export default Login