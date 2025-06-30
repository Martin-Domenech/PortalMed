import React, { useContext, useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Switch,
  Typography,
} from '@mui/material';
import {
  AiOutlineHome,
  AiOutlineCalendar,
  AiOutlineSetting,
  AiOutlineUsergroupAdd,
  AiOutlineLeft,
  AiOutlineRight,
} from 'react-icons/ai';
import { MdLogout } from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../App';
import openLogo from '/assets/logo-portalmed-sinbg.png';
import closeLogo from '/assets/logo-cruz-sinbg.png';

const drawerWidth = 240;
const collapsedWidth = 80;
const API_URL = import.meta.env.VITE_API_PORTALMED;

const mainItems = [
  { label: 'Home', icon: <AiOutlineHome />, to: '/' },
  { label: 'Pacientes', icon: <AiOutlineUsergroupAdd />, to: '/' },
  { label: 'Turnos', icon: <AiOutlineCalendar />, to: '/' },
];

const bottomItems = [
  { label: 'Configuración', icon: <AiOutlineSetting />, to: '/' },
  { label: 'Salir', icon: <MdLogout />, to: '/' },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen, checkAuth }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const open = sidebarOpen;
  const toggleDrawer = () => setSidebarOpen(prev => !prev);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/sessions/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) return console.error('Error al cerrar sesión');
      checkAuth();
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{
        sx: {
          width: open ? drawerWidth : collapsedWidth,
          overflowX: 'hidden',
          transition: 'width 0.3s',
          backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e',
          color: theme === 'light' ? '#000' : '#fff',
          borderRight: '1px solid #2c2c2c',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ position: 'relative', height: open ? 80 : 100 }}>

      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: theme === 'light' ? '#fff' : '#2c2c2c',
          boxShadow: 2,
          zIndex: 2,
          '&:hover': {
            backgroundColor: theme === 'light' ? '#eee' : '#444',
          },
        }}
      >
        {open ? <AiOutlineLeft /> : <AiOutlineRight />}
      </IconButton>

      <Box
        component="img"
        src={open ? openLogo : closeLogo}
        alt="logo"
        sx={{
          width: open ? '100%' : '80%',
          height: 'auto',
          objectFit: 'contain',
          mt: open ? 3 : 7,
          transition: 'all 0.3s',
          display: 'block',
          mx: 'auto',
        }}
      />
      </Box>

      <Box sx={{ mt: open ? 3 : 6 }}>
        <Divider 
        sx={{
          borderColor: '#2c2c2c',
          opacity: 0.6,
        }}
      />
      </Box>

      {/* Navegación principal */}
      <List 
      sx={{
        justifyContent: 'center',
        py: 3,
      }}>
        {mainItems.map(({ label, icon, to }) => (
          <ListItemButton
            key={label}
            component={NavLink}
            to={to}
            sx={{
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 2 : 'auto',
                justifyContent: 'center',
                color: 'inherit',
                fontSize: '1.5rem',
              }}
            >
              {icon}
            </ListItemIcon>
            {open && <ListItemText primary={label} />}
          </ListItemButton>
        ))}
      </List>

      <Box flexGrow={1} />

      <Divider 
        sx={{
          borderColor: '#2c2c2c',
          opacity: 0.6,
        }}
      />


      <List sx={{ mt: 1 }}>
        {bottomItems.map(({ label, icon, to }) => {
          const isLogout = label === 'Salir';
          return (
            <ListItemButton
              key={label}
              component={NavLink}
              to={isLogout ? '#' : to}
              onClick={isLogout ? handleLogout : undefined}
              sx={{
                px: 2.5,
                fontSize: '1.5rem',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                {icon}
              </ListItemIcon>
              {open && <ListItemText primary={label} />}
            </ListItemButton>
          );
        })}
      </List>

      <Box 
      p={2}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 3
      }}
      >
        {open && <Typography variant="body2">Dark Mode</Typography>}
        <Switch
          checked={theme === 'dark'}
          onChange={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
        />
      </Box>
    </Drawer>
  );
}