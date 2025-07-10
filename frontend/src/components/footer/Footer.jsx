import './Footer.css'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="footer">
        <div className="footer-content">
            <div className="footer-left">
                <div className="footer-brand">
                    <img src="/assets/logo-cruz-sinbg.png" alt="PortalMed Logo" className="footer-logo" />
                    <h2>PortalMed</h2>
                </div>
            <p>Tu sistema de gestión de consultorio médico.</p>
            </div>

            <div className="footer-links">
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><a href="#">Sobre nosotros</a></li>
                <li><a href="#">Contacto</a></li>
            </ul>
            </div>
        </div>

        <div className="footer-bottom">
            <p>&copy; 2025 PortalMed | Desarrollado por <span>Martin Domenech</span></p>
        </div>
    </footer>
  )
}