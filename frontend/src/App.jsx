import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from "./components/sidebar/Sidebar"
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"

function LayoutWithSidebar({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}



function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Login />} />
              
              <Route element={<LayoutWithSidebar />}>
                <Route path="/home" element={<Home />} />
                
              </Route>
            </Routes>
          </div>
      </div>
    </BrowserRouter>
  );
}

export default App;