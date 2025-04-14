import React from "react";
<<<<<<< HEAD
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
      
      
=======
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  LinearProgress, 
  Avatar, 
  styled, 
  useTheme,
  IconButton
} from "@mui/material";
import { 
  Event, 
  Assignment, 
  School, 
  CalendarToday,
  CheckCircle,
  Warning,
  AccessTime as AccessTimeIcon
} from "@mui/icons-material";

const HomePage = ({ events }) => {
  const theme = useTheme();

  // Datos de ejemplo para progreso académico
  const academicData = {
    progress: 65,
    absences: 2,
    daysRemaining: 87
  };

  // Obtener próximos eventos
  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      ?.filter(event => new Date(event.start) > now)
      ?.sort((a, b) => new Date(a.start) - new Date(b.start))
      ?.slice(0, 3) || [];
  };

  // Tareas de ejemplo (deberían venir de props)
  const sampleTasks = [
    { id: 1, title: "TP Matemáticas", dueDate: "23 Nov", color: "#ff5252" },
    { id: 2, title: "Leer capítulo 4", dueDate: "25 Nov", color: "#4fc3f7" },
    { id: 3, title: "Preparar presentación", dueDate: "28 Nov", color: "#66bb6a" }
  ];

  const StyledCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: "15px",
    transition: "transform 0.3s",
    height: '100%',
    '&:hover': {
      transform: "translateY(-5px)",
      boxShadow: theme.shadows[6]
    }
  }));

  const ProgressCircle = ({ progress }) => (
    <Box position="relative" display="inline-flex">
      <Avatar
        sx={{
          width: 80,
          height: 80,
          bgcolor: theme.palette.primary.light,
          boxShadow: theme.shadows[4]
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {progress}%
        </Typography>
      </Avatar>
      <CheckCircle 
        sx={{
          position: "absolute",
          right: -5,
          bottom: -5,
          fontSize: "2rem",
          color: theme.palette.success.main
        }}
      />
    </Box>
  );

  const EventCard = ({ event }) => {
    const eventDate = new Date(event.start);
    const daysRemaining = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24));

    return (
      <Box sx={{ 
        mb: 2, 
        p: 2,
        borderRadius: '12px',
        background: `linear-gradient(135deg, ${theme.palette.warning.light} 30%, #ffffff 100%)`,
        border: daysRemaining <= 2 ? `2px solid ${theme.palette.error.main}` : 'none'
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Event sx={{ color: theme.palette.warning.dark }} />
          <Typography variant="subtitle1" fontWeight="600">
            {event.title}
          </Typography>
        </Box>
        
        <Box mt={1} display="flex" justifyContent="space-between">
          <Typography variant="caption">
            {eventDate.toLocaleDateString('es-ES', {
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            })}
          </Typography>
          
          <Box display="flex" alignItems="center">
            <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
            <Typography variant="caption">
              {eventDate.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </Box>
        </Box>

        <Box mt={1} display="flex" alignItems="center" gap={1}>
          <LinearProgress 
            variant="determinate" 
            value={Math.min((1 - (daysRemaining/30)) * 100, 100)} 
            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
            color={daysRemaining <= 2 ? 'error' : 'primary'}
          />
          <Typography variant="caption" color="textSecondary">
            {daysRemaining}d
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box p={3}>
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 3, 
          color: theme.palette.primary.main,
          fontFamily: "'Pacifico', cursive",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
        }}
      >
        ¡Bienvenido de vuelta!
      </Typography>

      <Grid container spacing={3}>
        {/* Tarjeta de Progreso Académico */}
        <Grid item xs={12} md={4}>
          <StyledCard elevation={3}>
            <Box display="flex" alignItems="center" mb={2}>
              <School sx={{ fontSize: 30, mr: 1, color: theme.palette.secondary.main }} />
              <Typography variant="h6" fontWeight="bold">Mi Progreso</Typography>
            </Box>
            
            <Box textAlign="center">
              <ProgressCircle progress={academicData.progress} />
              <Box mt={2}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <Warning color="error" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Inasistencias: {academicData.absences}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <CalendarToday color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Días restantes: {academicData.daysRemaining}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </StyledCard>
        </Grid>

        {/* Próximos Eventos */}
        <Grid item xs={12} md={4}>
          <StyledCard elevation={3}>
            <Box display="flex" alignItems="center" mb={2}>
              <Event sx={{ fontSize: 30, mr: 1, color: theme.palette.warning.main }} />
              <Typography variant="h6" fontWeight="bold">Próximos Eventos</Typography>
            </Box>
            
            {getUpcomingEvents().length > 0 ? (
              getUpcomingEvents().map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <Box sx={{ 
                p: 2, 
                textAlign: 'center',
                bgcolor: theme.palette.grey[100],
                borderRadius: 2
              }}>
                <Typography variant="body2" color="textSecondary">
                  🎉 ¡No hay eventos próximos!
                </Typography>
              </Box>
            )}
          </StyledCard>
        </Grid>

        {/* Tareas Pendientes */}
        <Grid item xs={12} md={4}>
          <StyledCard elevation={3}>
            <Box display="flex" alignItems="center" mb={2}>
              <Assignment sx={{ fontSize: 30, mr: 1, color: theme.palette.error.main }} />
              <Typography variant="h6" fontWeight="bold">Tareas Pendientes</Typography>
            </Box>
            
            {sampleTasks.map((task) => (
              <Box 
                key={task.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1.5,
                  p: 1,
                  borderRadius: "8px",
                  bgcolor: theme.palette.grey[100]
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 30,
                    bgcolor: task.color,
                    borderRadius: "4px",
                    mr: 1.5
                  }}
                />
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {task.title}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {task.dueDate}
                </Typography>
              </Box>
            ))}
          </StyledCard>
        </Grid>
      </Grid>

      {/* Gráfico de Progreso */}
      <StyledCard elevation={3} sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" mb={2} fontWeight="bold">
          Rendimiento Académico
        </Typography>
        <Box 
          sx={{
            height: 200,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 30%, ${theme.palette.secondary.light} 90%)`,
            borderRadius: "12px",
            position: "relative"
          }}
        >
          {/* Espacio para gráfico real */}
          <Box 
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "70%",
              bgcolor: "rgba(255,255,255,0.3)",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px"
            }}
          />
        </Box>
      </StyledCard>
>>>>>>> fec83c1c2c03013d5db03457093750f5a40a3c58
    </Box>
  );
};

<<<<<<< HEAD
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

=======
>>>>>>> fec83c1c2c03013d5db03457093750f5a40a3c58
export default HomePage;