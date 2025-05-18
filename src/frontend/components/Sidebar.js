import React, { useState, useContext } from "react";
import { Box, Button, Avatar, Typography, Drawer, useMediaQuery } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Home, CalendarToday, Assignment, School, ShowChart, Settings, Menu as MenuIcon } from '@mui/icons-material';
import logo from "../assets/logoo.png";
import { useConfig } from "../context/ConfigContext";
import "../styles/components/Sidebar.css";
import { AuthContext } from "../context/AuthContext";
import { Logout } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

const menuItems = [
  { path: "/inicio", icon: <Home />, text: "Inicio" },
  { path: "/planificador", icon: <CalendarToday />, text: "Calendario" },
  { path: "/tareas", icon: <Assignment />, text: "Tareas Pendientes" },
  { path: "/examenes", icon: <School />, text: "Exámenes" },
  { path: "/progreso", icon: <ShowChart />, text: "Progreso Académico" }
];

// Mapeo de rutas a nombres de página
const pageTitles = {
  "/inicio": "Inicio",
  "/planificador": "Planificador",
  "/tareas": "Tareas Pendientes",
  "/examenes": "Exámenes",
  "/progreso": "Progreso Académico",
  "/configuracion": "Configuración"
};

function Sidebar() {
  const { config } = useConfig();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  // Obtiene el título de la página basado en la ruta actual
  const getPageTitle = () => {
    return pageTitles[location.pathname] || "StudyBot";
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  return (
    <>
      <Box
        Popscomponent="header"
        className="sidebar-header"
        style={{ backgroundColor: config.colorLateral }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            onClick={toggleDrawer(true)}
            className="menu-toggle-button"
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </Button>
          <Typography className="app-title">
            {getPageTitle()}
          </Typography>
        </Box>

        <Box className="user-section">
          <Avatar 
            src={config.profilePic} 
            className="user-avatar"
            alt={`Avatar de ${config.username}`}
          >
            {!config.profilePic && config.username?.[0]?.toUpperCase()}
          </Avatar>
          {!isMobile && (
            <Typography className="username-text">
              {config.username}
            </Typography>
          )}
          <Button 
            component={Link} 
            to="/configuracion" 
            className="config-button"
            aria-label="Configuración"
          >
            <Settings />
          </Button>
        </Box>
      </Box>

      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{
          BackdropProps: {
            className: "drawer-backdrop"
          }
        }}
        className="drawer-container"
        classes={{
          paper: "drawer-paper"
        }}
      >
        <Box 
          className="drawer-content"
          style={{ backgroundColor: config.colorLateral }}
        >
          <Box className="logo-container">
            <img 
              src={logo} 
              alt="Logo StudyBot" 
              className="logo-image" 
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                onClick={toggleDrawer(false)}
                className="menu-button"
                startIcon={item.icon}
                sx={{
                  backgroundColor: config.menuButtonColor,
                  '&:hover': {
                    backgroundColor: config.menuButtonHoverColor,
                  }
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          <Box className="drawer-footer" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tooltip title="Cerrar sesión" arrow>
              <Button
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
                color="secondary"
                aria-label="Cerrar sesión"
              >
                <Logout />
              </Button>
            </Tooltip>

            <Typography className="version-text">
              v1.0.0
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default Sidebar;