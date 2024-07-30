import "./Login.css"

export default function Login () {

    return(
        <div>
            <form id="form-login">
                <label htmlFor="">Usuario:</label>
                <input type="text" />
                <label htmlFor="">contraseña:</label>
                <input type="text" />
                <button type="submit">Iniciar sesión</button>
            </form>
        </div>
    )
}