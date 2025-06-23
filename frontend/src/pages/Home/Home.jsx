import "./Home.css"

function Home() {
  
  return (
    <section className="homePage">
      <section className="img-info">
        <h2>PortalMed: Gestión Integral de Turnos y Pacientes</h2>
        <p>Disfruta de una agenda médica, un historial clínico digital y mucho más. Mejora la organización y la gestión de tu consultorio médico.</p>
        <img src="/assets/home-img7.jpeg" alt="img" />
      </section>
      <section className="div-form">
        <h3>Sistema exclusivo para consultorios privados</h3>
        <h4>Rellena el formulario y recibe más información:</h4>
          <form  className='form-home'>
            <label htmlFor="first_name">Nombre:</label>
            <input type="text" name="first_name"  required autoComplete="off"/>
            
            <label htmlFor="last_name">Apellido:</label>
            <input type="text" name="last_name"  required autoComplete="off"/>
            
            <label htmlFor="email">Email:</label>
            <input type="email" name="email"  required autoComplete="off"/>
            
            <label htmlFor="age">Edad:</label>
            <input type="number" name="age"  required autoComplete="off"/>
            
            <label htmlFor="password">Contraseña:</label>
            <input type="password" name="password"  required autoComplete="new-password"/>
              
            <button type="submit">Enviar</button>
          </form>
      </section>
    </section>
  )
}

export default Home