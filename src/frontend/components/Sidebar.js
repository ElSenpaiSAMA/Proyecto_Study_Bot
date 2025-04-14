<<<<<<< HEAD
import React from "react";
import { Box, Button, Avatar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Home, CalendarToday, Assignment, School, ShowChart, Settings } from '@mui/icons-material';
import logo from "../assets/logoo.png";
import { useConfig } from "../context/ConfigContext";

function Sidebar() {
  const { config } = useConfig();

  return (
    <Box
      sx={{
        width: 250,
        bgcolor: config.colorLateral,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        alignItems: "center",
        paddingLeft: 1,
        paddingRight: 1,
        boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box mb={2}>
        <img src={logo} alt="StudyBot Logo" width={240} height={200} />
      </Box>

      <Box display="flex" flexDirection="column" width="100%">
        <Button component={Link} to="/inicio" startIcon={<Home />} fullWidth variant="contained" sx={buttonStyle}>
          Inicio
        </Button>
        <Button component={Link} to="/planificador" startIcon={<CalendarToday />} fullWidth variant="contained" sx={buttonStyle}>
          Calendario
        </Button>
        <Button component={Link} to="/tareas" startIcon={<Assignment />} fullWidth variant="contained" sx={buttonStyle}>
          Tareas Pendientes
        </Button>
        <Button component={Link} to="/examenes" startIcon={<School />} fullWidth variant="contained" sx={buttonStyle}>
          Exámenes
        </Button>
        <Button component={Link} to="/progreso" startIcon={<ShowChart />} fullWidth variant="contained" sx={buttonStyle}>
          Progreso Académico
        </Button>
      </Box>

      <Box
        sx={{
          bgcolor: config.colorLateralFooter,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          mt: "auto",
        }}
      >
        <Avatar src={config.profilePic} sx={{ width: 30, height: 30 }}>{!config.profilePic && config.username[0]}</Avatar>
        <Typography sx={{ flexGrow: 1, textAlign: "center", fontSize: "0.9rem", fontWeight: 500, color: "white" }}>
          {config.username}
        </Typography>
        <Button component={Link} to="/configuracion" startIcon={<Settings />} sx={{ minWidth: 0, p: 0 }} />
      </Box>
    </Box>
  );
}

const buttonStyle = {
  mb: 1,
  bgcolor: "rgba(255, 255, 255, 0.15)",
  color: "white",
  textTransform: "none",
  justifyContent: "flex-start",
  fontSize: "0.95rem",
  fontWeight: 500,
  '&:hover': { bgcolor: "rgba(255, 255, 255, 0.25)" },
};

=======
import React, { useState } from "react";
import { Box, Button, Avatar, Typography, Drawer, useMediaQuery } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Home, CalendarToday, Assignment, School, ShowChart, Settings, Menu as MenuIcon } from '@mui/icons-material';
import logo from "../assets/logoo.png";
import { useConfig } from "../context/ConfigContext";
import "../styles/components/Sidebar.css";

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
  const location = useLocation(); // Obtiene la ruta actual

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
        component="header"
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
            {getPageTitle()} {/* Muestra el título de la página actual */}
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
              >
                {item.text}
              </Button>
            ))}
          </Box>

          <Box className="drawer-footer">
            <Typography className="version-text">
              v1.0.0
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

>>>>>>> fec83c1c2c03013d5db03457093750f5a40a3c58
export default Sidebar;