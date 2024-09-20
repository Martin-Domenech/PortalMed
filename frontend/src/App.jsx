import { BrowserRouter, Routes, Route} from "react-router-dom"
import React, { useState } from "react"
import { Sidebar } from "./components/sidebar/Sidebar"
import { Light, Dark } from "./styles/Themes"
import { ThemeProvider } from "styled-components"
import styled from "styled-components"
import Home  from "./pages/home/Home"
import Register from "./pages/register/Register"
import Login from "./pages/login/Login"

export const ThemeContext = React.createContext(null);

function App() {

  const [theme, setTheme] = useState("dark");
  const themeStyle = theme === "light" ? Light : Dark;

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <ThemeProvider theme={themeStyle}>
        <BrowserRouter>
          <Container className={sidebarOpen ? "sidebarState active" : ""}>
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            <Routes> 
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
    
  );
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