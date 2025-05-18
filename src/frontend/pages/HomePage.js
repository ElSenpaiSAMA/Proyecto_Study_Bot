import React from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  LinearProgress, 
  Avatar, 
  styled, 
  useTheme,
  IconButton,
  Badge
} from "@mui/material";
import { 
  Event, 
  CalendarToday,
  CheckCircle,
  AccessTime as AccessTimeIcon,
  Notifications,
  MoreVert,
  TrendingUp,
  School
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const HomePage = ({ events }) => {
  const theme = useTheme();

  // Datos de ejemplo para progreso académico (sin inasistencias, racha ni ranking ni días restantes)
  const academicData = {
    progress: 78
  };

  // Obtener próximos eventos
  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      ?.filter(event => new Date(event.start) > now)
      ?.sort((a, b) => new Date(a.start) - new Date(b.start))
      ?.slice(0, 3) || [];
  };

  // Tareas de ejemplo
  const sampleTasks = [
    { id: 1, title: "Examen Filosofía", dueDate: "23 Nov", color: "#ff5252", completed: false },
    { id: 2, title: "Leer capítulo 4", dueDate: "25 Nov", color: "#4fc3f7", completed: true },
    { id: 3, title: "Preparar presentación", dueDate: "28 Nov", color: "#66bb6a", completed: false }
  ];

  const StyledCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2.5),
    borderRadius: "16px",
    transition: "all 0.3s ease",
    height: '100%',
    background: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff',
    boxShadow: theme.shadows[2],
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      transform: "translateY(-8px)",
      boxShadow: theme.shadows[8],
      borderColor: theme.palette.primary.light
    }
  }));

  const ProgressCircle = ({ progress }) => (
    <Box position="relative" display="inline-flex" sx={{ animation: `${pulseAnimation} 2s infinite` }}>
      <Avatar
        sx={{
          width: 100,
          height: 100,
          bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
          boxShadow: `0 4px 20px ${theme.palette.primary.light}80`,
          border: `3px solid ${theme.palette.primary.main}`
        }}
      >
        <Typography variant="h5" fontWeight="bold" color={theme.palette.mode === 'dark' ? 'white' : 'primary.dark'}>
          {progress}%
        </Typography>
      </Avatar>
      <CheckCircle 
        sx={{
          position: "absolute",
          right: -5,
          bottom: -5,
          fontSize: "2.5rem",
          color: theme.palette.success.main,
          bgcolor: 'background.paper',
          borderRadius: '50%'
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
        borderRadius: '14px',
        background: `linear-gradient(135deg, ${theme.palette.warning.light}20 0%, ${theme.palette.background.paper} 100%)`,
        borderLeft: `4px solid ${theme.palette.warning.main}`,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: theme.shadows[2]
        }
      }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Event sx={{ 
            color: theme.palette.warning.main,
            fontSize: '1.8rem',
            p: 0.5,
            bgcolor: theme.palette.warning.light + '30',
            borderRadius: '8px'
          }} />
          <Typography variant="subtitle1" fontWeight="600" sx={{ flexGrow: 1 }}>
            {event.title}
          </Typography>
          {daysRemaining <= 2 && (
            <Badge 
              badgeContent="!" 
              color="error" 
              sx={{ 
                '& .MuiBadge-badge': { 
                  fontSize: '1rem', 
                  height: 24, 
                  minWidth: 24,
                  transform: 'translate(-50%, 20%)'
                } 
              }}
            />
          )}
        </Box>
        
        <Box mt={1.5} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarToday sx={{ 
              fontSize: 18, 
              color: theme.palette.text.secondary 
            }} />
            <Typography variant="body2" fontWeight="500">
              {eventDate.toLocaleDateString('es-ES', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
              })}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTimeIcon sx={{ 
              fontSize: 18, 
              color: theme.palette.text.secondary 
            }} />
            <Typography variant="body2" fontWeight="500">
              {eventDate.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </Box>
        </Box>

        <Box mt={2} display="flex" alignItems="center" gap={1.5}>
          <LinearProgress 
            variant="determinate" 
            value={Math.min((1 - (daysRemaining/30)) * 100, 100)} 
            sx={{ 
              flexGrow: 1, 
              height: 8, 
              borderRadius: 4,
              bgcolor: theme.palette.grey[200]
            }}
            color={daysRemaining <= 2 ? 'error' : 'warning'}
          />
          <Typography variant="body2" fontWeight="600" color={daysRemaining <= 2 ? 'error.main' : 'text.secondary'}>
            {daysRemaining}d
          </Typography>
        </Box>
      </Box>
    );
  };

  const TaskItem = ({ task }) => (
    <Box 
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 1.5,
        p: 1.5,
        borderRadius: "12px",
        bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateX(4px)',
          boxShadow: theme.shadows[1]
        }
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 34,
          bgcolor: task.color,
          borderRadius: "4px",
          mr: 2,
          opacity: task.completed ? 0.5 : 1
        }}
      />
      <Typography 
        variant="body2" 
        sx={{ 
          flexGrow: 1,
          textDecoration: task.completed ? 'line-through' : 'none',
          opacity: task.completed ? 0.7 : 1
        }}
      >
        {task.title}
      </Typography>
      <Box 
        sx={{ 
          bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
          px: 1.5,
          py: 0.5,
          borderRadius: '12px'
        }}
      >
        <Typography variant="caption" fontWeight="600">
          {task.dueDate}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box p={3} sx={{ background: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[50] }}>
      {/* Header con título y acciones */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: "800",
              color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
              mb: 0.5
            }}
          >
            ¡Bienvenido de vuelta!
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box component="span" sx={{ 
              width: 12, 
              height: 12, 
              bgcolor: theme.palette.success.main, 
              borderRadius: '50%' 
            }} />
            Última actualización: Hoy
          </Typography>
        </Box>

        <IconButton aria-label="notificaciones" size="large" sx={{ color: theme.palette.text.secondary }}>
          <Badge color="error" badgeContent={3}>
            <Notifications />
          </Badge>
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Progreso académico */}
        <Grid item xs={12} md={6} lg={4}>
          <StyledCard>
            <Box display="flex" alignItems="center" gap={3} flexDirection={{ xs: "column", sm: "row" }}>
              <ProgressCircle progress={academicData.progress} />
              <Box>
                <Typography variant="h6" fontWeight="700" gutterBottom>
                  Progreso Académico
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Has completado {academicData.progress}% de tu curso.
                </Typography>
              </Box>
            </Box>
          </StyledCard>
        </Grid>

        {/* Próximos eventos */}
        <Grid item xs={12} md={6} lg={4}>
          <StyledCard>
            <Typography variant="h6" fontWeight="700" mb={2}>
              Próximos Eventos
            </Typography>
            {getUpcomingEvents().length === 0 && (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                No hay eventos próximos.
              </Typography>
            )}
            {getUpcomingEvents().map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </StyledCard>
        </Grid>

        {/* Tareas pendientes */}
        <Grid item xs={12} md={12} lg={4}>
          <StyledCard>
            <Typography variant="h6" fontWeight="700" mb={2}>
              Tareas Pendientes
            </Typography>
            {sampleTasks.length === 0 && (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                No tienes tareas pendientes.
              </Typography>
            )}
            {sampleTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
