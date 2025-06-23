import { BrowserRouter, Routes, Route} from "react-router-dom"
import './styles/App.css'
import React, { useState, useEffect, Fragment} from "react"
import { Sidebar } from "./components/sidebar/Sidebar"
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

export const ThemeContext = React.createContext(null);
const API_URL = import.meta.env.VITE_API_PORTALMED

function App() {


  const [theme, setTheme] = useState("dark")
  const themeStyle = theme === "light" ? Light : Dark

  const [sidebarOpen, setSidebarOpen] = useState(true)

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
  
  ///// revisar consumo del servidor /////
  useEffect(() => {
    checkAuth()

    const intervalId = setInterval(() => {
      checkAuth();
    }, 300000); // 5 minutos = 300,000 milisegundos

    return () => clearInterval(intervalId);
  }, [])
  /////

  if (loading) {
    return (
      <div className="loadingCircle">
        <CircularProgress  size="5rem"/>
      </div>
    )
  }

  const IsAuth = () => {
    return (
      <Container className={sidebarOpen ? "sidebarState active" : ""}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} checkAuth={checkAuth}/>
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update-patient/:id" element={<UpdatePatient />} />
          <Route path="/patient-detail/:id" element={<PatientsDetail />} />
        </Routes>
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



  return (
    
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <ThemeProvider theme={themeStyle}>
        <BrowserRouter>
          {userLogged ? <IsAuth /> : <IsNotAuth />}
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
    
  )
}



const Container = styled.div`
  display: grid;
  grid-template-columns: 90px auto;
  background: ${({ theme }) => theme.bgtotal};
  transition:all 0.3s ;
  &.active {
    grid-template-columns: 300px auto;
  }
  color:${({theme})=>theme.text};
`;

export default App