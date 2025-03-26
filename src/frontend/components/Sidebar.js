import React from "react";
import { Box, Button, Avatar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Home, CalendarToday, Assignment, School, ShowChart, Settings } from '@mui/icons-material';
import logo from "../assets/logoo.png";

function Sidebar() {
  return (
    <Box
      sx={{
        width: 250,
        bgcolor: "#98cdd5",
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
        <Button
          component={Link}
          to="/inicio"
          startIcon={<Home />}
          fullWidth
          variant="contained"
          sx={buttonStyle}
        >
          Inicio
        </Button>
        <Button
          component={Link}
          to="/planificador"
          startIcon={<CalendarToday />}
          fullWidth
          variant="contained"
          sx={buttonStyle}
        >
          Calendario
        </Button>
        <Button
          component={Link}
          to="/tareas"
          startIcon={<Assignment />}
          fullWidth
          variant="contained"
          sx={buttonStyle}
        >
          Tareas Pendientes
        </Button>
        <Button
          component={Link}
          to="/examenes"
          startIcon={<School />}
          fullWidth
          variant="contained"
          sx={buttonStyle}
        >
          Exámenes
        </Button>
        <Button
          component={Link}
          to="/progreso"
          startIcon={<ShowChart />}
          fullWidth
          variant="contained"
          sx={buttonStyle}       
        >
          Progreso Académico
        </Button>
      </Box>

      <Box
        sx={{
          bgcolor: "#8eccd5",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          mt: "auto",
        }}
      >
        <Avatar sx={{ width: 30, height: 30 }}>HP</Avatar>
        <Typography sx={{ flexGrow: 1, textAlign: "center", fontSize: "0.9rem", fontWeight: 500, color: "white" }}>
          Hugo Pérez
        </Typography>
        <Button component={Link} to="/configuracion" startIcon={<Settings />} sx={{ minWidth: 0, p: 0 }}>
        </Button>
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
  '&:hover': {
    bgcolor: "rgba(255, 255, 255, 0.25)", 
  },
};

export default Sidebar;
