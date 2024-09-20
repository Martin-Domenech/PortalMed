import styled from "styled-components";
import closeLogo from "/assets/logo-cruz-sinbg.png";
import openLogo from "/assets/logo-portalmed-sinbg.png"
import { v } from "../../styles/Variables";
import {
  AiOutlineLeft,
  AiOutlineHome,
  AiOutlineCalendar,
  AiOutlineSetting,
  AiOutlineUsergroupAdd
} from "react-icons/ai";
import { MdOutlineAnalytics, MdLogout } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../App";
import { useNavigate } from 'react-router-dom';



export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const ModSidebaropen = () => {
    setSidebarOpen(!sidebarOpen);
  }
  
  const { setTheme, theme } = useContext(ThemeContext);
  const CambiarTheme = () => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  }

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sessions/logout', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      if (!response.ok) return console.error('Error al cerrar sesion')
      console.log('Logout exitoso')
      navigate('/')
      
    } catch (error) {
      console.error('Error:', error);
    }
  }


  return (
    <Container isOpen={sidebarOpen} themeUse={theme}>
      <button className="Sidebarbutton" onClick={ModSidebaropen}>
        <AiOutlineLeft />
      </button>
      <div className="Logocontent">
        <div className="imgcontent">
          <img src={sidebarOpen ? openLogo : closeLogo} alt="logo"/>
        </div>
      </div>
      <Divider2 />
      {linksArray.map(({ icon, label, to }) => (
        <div className="LinkContainer" key={label}>
          <NavLink
            to={to}
            className={({ isActive }) => `Links${isActive ? ` active` : ``}`}
          >
            <div className="Linkicon">{icon}</div>
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        </div>
      ))}
      <Divider />
      {secondarylinksArray.map(({ icon, label, to }) => (
        <div className="LinkContainer" key={label}>
          <NavLink
            to={to}
            className={({ isActive }) => `Links${isActive ? ` active` : ``}`}
            onClick={label === "Salir" ? handleLogout : undefined}
          >
            <div className="Linkicon">{icon}</div>
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        </div>
      ))}
      <Divider />
      <div className="Themecontent">
        {sidebarOpen && <span className="titletheme">Dark mode</span>}
        <div className="Togglecontent">
          <div className="grid theme-container">
            <div className="content">
              <div className="demo">
                <label className="switch" istheme={theme}>
                  <input
                    istheme={theme}
                    type="checkbox"
                    className="theme-swither"
                    onClick={CambiarTheme}
                  ></input>
                  <span istheme={theme} className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
//#region Data links
const linksArray = [
  {
    label: "Home",
    icon: <AiOutlineHome />,
    to: "/",
  },
  {
    label: "Pacientes",
    icon: <AiOutlineUsergroupAdd />,
    to: "/estadisticas",
  },
  {
    label: "Turnos",
    icon: <AiOutlineCalendar />,
    to: "/calendar",
  },
  {
    label: "Iniciar sesión",
    icon: <MdOutlineAnalytics />,
    to: "/login",
  },
  {
    label: "Registrar usuario",
    icon: <MdOutlineAnalytics />,
    to: "/register",
  },
];
const secondarylinksArray = [
  {
    label: "Configuración",
    icon: <AiOutlineSetting />,
    to: "/",
  },
  {
    label: "Salir",
    icon: <MdLogout />,
    to: "/",
  },
];
//#endregion

//#region STYLED COMPONENTS
const Container = styled.div`
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.bg};
  position: sticky;
  top: 0;
  padding-top: ${({ isOpen }) => (isOpen ? `10px` : '50px')};
  height: 100vh; /* Ocupa toda la altura del viewport */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Evita el scroll en el sidebar */
  border-right: 1px solid ${(props) => props.theme.bgBorder};

  .Sidebarbutton {
    position: absolute;
    top: ${v.smSpacing};
    right: ${({ isOpen }) => (isOpen ? `5px` : '25px')}; /* Ajusta según el ancho del botón y el contenedor */
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${(props) => props.theme.bgtgderecha};
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5), /* Sombra más oscura y más difusa */
    0 0 10px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    transform: ${({ isOpen }) => (isOpen ? `initial` : `rotate(180deg)`)}; /* Rotación según el estado abierto/cerrado */
    border: none;
    letter-spacing: inherit;
    color: inherit;
    font-size: inherit;
    text-align: inherit;
    padding: 0;
    font-family: inherit;
    outline: none;
    z-index: 1000; /* Asegúrate de que el botón esté sobre otros elementos */
  }

  .Logocontent {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: ${v.lgSpacing};
    flex-shrink: 0;

    .imgcontent {
      display: flex;
      img {
        max-width: 100%;
        height: auto;
      }
      cursor: pointer;
      transform: ${({ isOpen }) => (isOpen ? `scale(0.9)` : `scale(0.7)`)};
    }
  }

  .LinkContainer {
    margin: 8px 0;
    padding: 0 15%;
    flex-shrink: 0;

    :hover {
      background: ${(props) => props.theme.bg3};
    }

    .Links {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: calc(${v.smSpacing}-2px) 0;
      color: ${(props) => props.theme.text};
      height: 50px;

      .Linkicon {
        padding: ${v.smSpacing} ${v.mdSpacing};
        display: flex;

        svg {
          font-size: 25px;
        }
      }

      &.active {
        .Linkicon {
          svg {
            color: ${(props) => props.theme.bg4};
          }
        }
      }
    }
  }

  .Themecontent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding: 10px 0;

    .titletheme {
      display: block;
      padding: 10px;
      font-weight: 500;
      opacity: ${({ isOpen }) => (isOpen ? `1` : `0`)};
      transition: all 0.3s;
      white-space: nowrap;
      overflow: hidden;
    }

    .Togglecontent {
      margin: ${({ isOpen }) => (isOpen ? `auto 40px` : `auto 15px`)};
      width: 36px;
      height: 20px;
      padding-bottom: 30px;
      border-radius: 10px;
      transition: all 0.3s;
      position: relative;

      .theme-container {
        background-blend-mode: multiply, multiply;
        transition: 0.4s;

        .grid {
          display: grid;
          justify-items: center;
          align-content: center;
          height: 100vh;
          width: 100vw;
          font-family: "Lato", sans-serif;
        }

        .demo {
          font-size: 32px;

          .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;

            .theme-swither {
              opacity: 0;
              width: 0;
              height: 0;

              &:checked + .slider:before {
                left: 4px;
                content: "⚫";
                transform: translateX(26px);
              }
            }

            .slider {
              position: absolute;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: ${({ themeUse }) =>
                themeUse === "light" ? v.lightcheckbox : v.checkbox};
              transition: 0.4s;

              &::before {
                position: absolute;
                content: "⚪";
                height: 0px;
                width: 0px;
                left: -10px;
                top: 16px;
                line-height: 0px;
                transition: 0.4s;
              }

              &.round {
                border-radius: 34px;

                &::before {
                  border-radius: 50%;
                }
              }
            }
          }
        }
      }
    }
  }
`;
const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${(props) => props.theme.bgBorder};
  margin: ${v.lgSpacing} 0;
`;
const Divider2 = styled.div`
  height: 1px;
  width: 100%;
  background: ${(props) => props.theme.bgBorder};
  margin: 0;
`;
//#endregion