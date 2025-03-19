import React from "react";
import { Box, Button, Avatar, Typography } from "@mui/material";
import Logo from "../images/logo.jpg";

const Sidebar = () => (
  <Box
    sx={{
      width: 250,
      bgcolor: "#3c8c74",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      p: 2,
    }}
  >
    <Box mb={2}>
      <img src={Logo} alt="StudyBot Logo" width={120} />
    </Box>
    <Box display="flex" flexDirection="column" width="100%">
      <Button fullWidth variant="contained" sx={{ mb: 1, bgcolor: "white", color: "black" }}>
        Inicio
      </Button>
      <Button fullWidth variant="contained" sx={{ mb: 1, bgcolor: "white", color: "black" }}>
        Calendario
      </Button>
      <Button fullWidth variant="contained" sx={{ mb: 1, bgcolor: "white", color: "black" }}>
        Tareas Pendientes
      </Button>
      <Button fullWidth variant="contained" sx={{ mb: 1, bgcolor: "white", color: "black" }}>
        Exámenes
      </Button>
      <Button fullWidth variant="contained" sx={{ bgcolor: "white", color: "black" }}>
        Progreso Académico
      </Button>
    </Box>
    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mt="auto" color="white" p={1}>
      <Avatar sx={{ width: 30, height: 30 }}>JS</Avatar>
      <Typography sx={{ flexGrow: 1, textAlign: "center" }}>Jofesfina Sanchez</Typography>
      <Avatar sx={{ bgcolor: "gray", width: 30, height: 30 }}>⚙</Avatar>
    </Box>
  </Box>
);

export default Sidebar;
