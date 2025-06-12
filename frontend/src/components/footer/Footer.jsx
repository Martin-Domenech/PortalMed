import './Footer.css'
import { Link } from 'react-router-dom'

export const Footer = () => {

    return(
        <footer className="footer">
            <div className="footerContainer">
                <div className="footerNav">
                    <ul>
                        <li><Link to='/'>Inicio</Link></li>
                        <li><a href="#">Nosotros</a></li>
                        <li><a href="#">Contacto</a></li>

                    </ul>
                </div>
            </div>
            <div className="footerBottom">
                <p>Copyright &copy;2024; Designed by <span className="designer">Martin Domenech</span></p>
            </div>
        </footer>
    )
}