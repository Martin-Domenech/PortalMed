import { BrowserRouter, Routes, Route} from "react-router-dom"
import './styles/App.css'
import React, { useState, useEffect, Fragment} from "react"
import  Sidebar  from "./components/sidebar/Sidebar"
import { Light, Dark } from "./styles/Themes"
import { ThemeProvider } from "styled-components"
import styled from "styled-components"
import Register from "./pages/register/Register"
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import UserHome from "./pages/userHome/UserHome"
import NavBar from "./components/navbar/Navbar"
import { Footer } from "./components/footer/Footer"
import { CircularProgress } from "@mui/material"
import UpdatePatient from "./pages/updatePatient/UpdatePatient"
import PatientsDetail from "./pages/patientsDetail/PatientsDetail"
import { useNavigate, useLocation } from 'react-router-dom'

export const ThemeContext = React.createContext(null);
const API_URL = import.meta.env.VITE_API_PORTALMED

function App() {


  const [theme, setTheme] = useState("dark")
  const themeStyle = theme === "light" ? Light : Dark

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)

  const [userLogged, setUserLogged] = useState(false)

  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/sessions/islogged`, {
        method: 'GET',
        credentials: 'include'
      })
      setUserLogged(response.ok)
  
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }  
  
  
  useEffect(() => {
    const checkVisibility = () => {
      if (document.visibilityState === "visible") {
        checkAuth();
      }
    }

    checkAuth()

    document.addEventListener("visibilitychange", checkVisibility)

    return () => {
      document.removeEventListener("visibilitychange", checkVisibility)
    }
  }, [])

  /*
  useEffect(() => {
    checkAuth()

    const intervalId = setInterval(() => {
      checkAuth();
    }, 300000); // 5 minutos = 300,000 milisegundos

    return () => clearInterval(intervalId);
  }, [])
  */

  if (loading) {
    return (
      <div className="loadingCircle">
        <CircularProgress  size="5rem"/>
      </div>
    )
  }

  const IsAuth = () => {
    return (
      <Container sidebarOpen={sidebarOpen}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          checkAuth={checkAuth}
        />
        <div className="content">
          <Routes>
            <Route path="/" element={<UserHome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/update-patient/:id" element={<UpdatePatient />} />
            <Route path="/patient-detail/:id" element={<PatientsDetail />} />
          </Routes>
        </div>
      </Container>
    )
  }

  const IsNotAuth = () => {
    return (
      <Fragment>
        <NavBar /> 
        <main className="bg">
          <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login checkAuth={checkAuth} />} />
          </Routes>
        </main>
        <Footer />
      </Fragment>
    )
  }

  function RedirectIfNotAuth() {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
      const isPublicRoute = location.pathname === '/' || location.pathname === '/login'

      if (!loading && !userLogged && !isPublicRoute) {
        navigate('/login')
      }
    }, [userLogged, loading, location.pathname])

    return null
  }


  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <ThemeProvider theme={themeStyle}>
        <BrowserRouter>
          <RedirectIfNotAuth />
          {userLogged ? <IsAuth /> : <IsNotAuth />}
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
    
  )
}



const Container = styled.div`
  display: flex;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  height: 100vh;
  overflow: hidden;

  .content {
    flex-grow: 1;
    height: 100%;
    overflow-y: auto;
    transition: padding-left 0.3s;
    padding-left: ${({ sidebarOpen }) => (sidebarOpen ? '240px' : '60px')}; /* sincronizado con Drawer */
    box-sizing: border-box;
  }
`;

export default App