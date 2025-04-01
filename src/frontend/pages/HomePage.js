import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import Sidebar from "../components/Sidebar";
import '../styles/HomePage.css'; 

const HomePage = () => {
  return (
    <Box display="flex" height="100vh">      
      <Box flexGrow={1} p={3} bgcolor="#fff">
        <Typography variant="h4" sx={{ borderBottom: "2px solid black", pb: 1 }}>
          Inicio
        </Typography>
        
        <Box display="flex" justifyContent="space-between" mt={3}>
          <TaskList title="Tareas pendientes" />
          <TaskList title="Eventos Próximos" />
        </Box>
        
        <Box mt={3}>
          <Typography variant="h6">Gráficos</Typography>
          <Paper sx={{ width: 250, height: 150, mt: 1 }}>
          </Paper>
        </Box>
      </Box>
      
      
    </Box>
  );
};

const TaskList = ({ title }) => (
  <Box>
    <Typography variant="h6" sx={{ borderBottom: "1px solid black" }}>
      {title}
    </Typography>
    {[...Array(5)].map((_, index) => (
      <Paper
        key={index}
        sx={{ width: 200, height: 30, my: 0.5, borderRadius: 15, bgcolor: "lightgray" }}
      />
    ))}
  </Box>
);

export default HomePage;