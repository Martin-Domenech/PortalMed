import './Login.css'
import { useState } from 'react' 
import { useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_PORTALMED
function Login ({checkAuth}) {
    const [error, setError] = useState(false)
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
            const response = await fetch(`${API_URL}/api/sessions/login`, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
                credentials: 'include',
            })

            if(!response.ok){
                const errorMessage = await response.text()
                setError(true)
                setUser({
                    ...user,
                    password: ''
                })
                throw new Error(`Error en el registro: ${errorMessage}`)
            }
            console.log(`Login exitoso`)
            setError(false)
            checkAuth()
            navigate('/')

        } catch (error) {
            console.error('Error:', error)
            setUser({
                ...user,
                password: ''
            })
            setError(true)
        }
    }
    
    return(
        <div className="login">
            <h2>Iniciar sesión:</h2>
            <form onSubmit={handleSubmit} className='form'>
                {error ? 
                    <label htmlFor="email"><span>*   </span>  Ingrese su correo electrónico:</label> :
                    <label htmlFor="email">Ingrese su correo electrónico:</label>
                }
                <input type="text" name="email" value={user.email} onChange={handleChange} required/>
                
                {error ? 
                    <label htmlFor="password"><span>*   </span>Contraseña:</label> :
                    <label htmlFor="password">Contraseña:</label>
                }   
                <input type="password" name="password" value={user.password} onChange={handleChange} required autoComplete="new-password"/>
                
                {error && <p className="error">* Por favor, revise los campos ingresados.</p>}
                
                <button type="submit">Iniciar sesión</button>
            </form>
        </div>
    )
}

export default Login