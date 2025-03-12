import React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const SchedulePlanner = () => {
  return (
    <Box display="flex" height="100vh" p={4}>
      {/* Left section: Schedule title and navigation */}
      <Box flex={1} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" gutterBottom>
          <u>Planificador de Horarios</u>
        </Typography>
        
        {/* Date navigation */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <IconButton>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h6">Fecha de hoy</Typography>
          <IconButton>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        {/* Placeholder for schedule entries */}
        <Box width="80%" height="100px" bgcolor="#E0E0E0" borderRadius={2} mb={2}></Box>
        <Box width="80%" height="100px" bgcolor="#E0E0E0" borderRadius={2} mb={2}></Box>
        <Box width="80%" height="100px" bgcolor="#E0E0E0" borderRadius={2}></Box>
      </Box>
      
      {/* Right section: Google Calendar integration */}
      <Box flex={1} display="flex" justifyContent="center" alignItems="center" bgcolor="#F5F5F5" borderRadius={2}>
        <Typography variant="h6">Aquí se integrará Google Calendar</Typography>
      </Box>
    </Box>
  );
};

export default SchedulePlanner;
