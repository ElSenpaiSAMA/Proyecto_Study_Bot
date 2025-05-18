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
  Assignment, 
  School, 
  CalendarToday,
  CheckCircle,
  Warning,
  AccessTime as AccessTimeIcon,
  Notifications,
  MoreVert,
  TrendingUp,
  EmojiEvents
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const HomePage = ({ events }) => {
  const theme = useTheme();

  // Datos de ejemplo para progreso académico
  const academicData = {
    progress: 78,
    absences: 2,
    daysRemaining: 87,
    streak: 14,
    rank: "Top 15%"
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
              width: 8, 
              height: 8, 
              bgcolor: theme.palette.success.main, 
              borderRadius: '50%',
              display: 'inline-block'
            }} />
            Tienes {sampleTasks.filter(t => !t.completed).length} tareas pendientes hoy
          </Typography>
        </Box>
        
        <Box display="flex" gap={1}>
          <IconButton sx={{ 
            bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300]
            }
          }}>
            <Notifications />
          </IconButton>
          <IconButton sx={{ 
            bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300]
            }
          }}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Tarjeta de Progreso Académico */}
        <Grid item xs={12} md={4}>
          <StyledCard elevation={0}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center">
                <School sx={{ 
                  fontSize: 32, 
                  mr: 1.5, 
                  color: theme.palette.secondary.main,
                  p: 0.5,
                  bgcolor: theme.palette.secondary.light + '20',
                  borderRadius: '10px'
                }} />
                <Typography variant="h6" fontWeight="700">Mi Progreso</Typography>
              </Box>
              <TrendingUp sx={{ 
                color: theme.palette.success.main,
                fontSize: 28
              }} />
            </Box>
            
            <Box textAlign="center" sx={{ mb: 3 }}>
              <ProgressCircle progress={academicData.progress} />
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: '12px',
                    bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                    textAlign: 'center'
                  }}
                >
                  <Warning sx={{ 
                    color: theme.palette.error.main,
                    fontSize: 28,
                    mb: 0.5
                  }} />
                  <Typography variant="body2" fontWeight="600">
                    Inasistencias
                  </Typography>
                  <Typography variant="h6" fontWeight="800">
                    {academicData.absences}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: '12px',
                    bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                    textAlign: 'center'
                  }}
                >
                  <CalendarToday sx={{ 
                    color: theme.palette.info.main,
                    fontSize: 28,
                    mb: 0.5
                  }} />
                  <Typography variant="body2" fontWeight="600">
                    Días restantes
                  </Typography>
                  <Typography variant="h6" fontWeight="800">
                    {academicData.daysRemaining}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: '12px',
                    bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                    textAlign: 'center'
                  }}
                >
                  <Box sx={{ 
                    color: theme.palette.warning.main,
                    fontSize: 28,
                    mb: 0.5
                  }}>🔥</Box>
                  <Typography variant="body2" fontWeight="600">
                    Racha
                  </Typography>
                  <Typography variant="h6" fontWeight="800">
                    {academicData.streak}d
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: '12px',
                    bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                    textAlign: 'center'
                  }}
                >
                  <EmojiEvents sx={{ 
                    color: theme.palette.primary.main,
                    fontSize: 28,
                    mb: 0.5
                  }} />
                  <Typography variant="body2" fontWeight="600">
                    Ranking
                  </Typography>
                  <Typography variant="h6" fontWeight="800">
                    {academicData.rank}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </StyledCard>
        </Grid>

        {/* Próximos Eventos */}
        <Grid item xs={12} md={4}>
          <StyledCard elevation={0}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center">
                <Event sx={{ 
                  fontSize: 32, 
                  mr: 1.5, 
                  color: theme.palette.warning.main,
                  p: 0.5,
                  bgcolor: theme.palette.warning.light + '20',
                  borderRadius: '10px'
                }} />
                <Typography variant="h6" fontWeight="700">Próximos Eventos</Typography>
              </Box>
              <Typography variant="caption" sx={{ 
                bgcolor: theme.palette.warning.light + '30',
                color: theme.palette.warning.dark,
                px: 1.5,
                py: 0.5,
                borderRadius: '12px',
                fontWeight: '600'
              }}>
                {getUpcomingEvents().length} nuevos
              </Typography>
            </Box>
            
            {getUpcomingEvents().length > 0 ? (
              getUpcomingEvents().map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <Box sx={{ 
                p: 3, 
                textAlign: 'center',
                bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] + '80' : theme.palette.grey[100],
                borderRadius: '14px',
                border: `1px dashed ${theme.palette.divider}`
              }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  🎉
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  No hay eventos próximos. ¡Disfruta tu día!
                </Typography>
              </Box>
            )}
          </StyledCard>
        </Grid>

        {/* Tareas Pendientes */}
        <Grid item xs={12} md={4}>
          <StyledCard elevation={0}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center">
                <Assignment sx={{ 
                  fontSize: 32, 
                  mr: 1.5, 
                  color: theme.palette.error.main,
                  p: 0.5,
                  bgcolor: theme.palette.error.light + '20',
                  borderRadius: '10px'
                }} />
                <Typography variant="h6" fontWeight="700">Tareas Pendientes</Typography>
              </Box>
              <Typography variant="caption" sx={{ 
                bgcolor: theme.palette.error.light + '30',
                color: theme.palette.error.dark,
                px: 1.5,
                py: 0.5,
                borderRadius: '12px',
                fontWeight: '600'
              }}>
                {sampleTasks.filter(t => !t.completed).length} por hacer
              </Typography>
            </Box>
            
            {sampleTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
            
            <Box 
              sx={{ 
                mt: 2, 
                p: 1.5, 
                textAlign: 'center',
                bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.dark + '30' : theme.palette.primary.light + '20',
                borderRadius: '12px',
                border: `1px solid ${theme.palette.primary.light}`,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.dark + '50' : theme.palette.primary.light + '30'
                }
              }}
            >
              <Typography variant="body2" fontWeight="600" color="primary.main">
                + Añadir nueva tarea
              </Typography>
            </Box>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Gráfico de Progreso */}
      <StyledCard elevation={0} sx={{ mt: 3, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="700">
            Rendimiento Académico
          </Typography>
          <Box display="flex" gap={1}>
            <Typography variant="caption" sx={{ 
              bgcolor: theme.palette.primary.light + '30',
              color: theme.palette.primary.dark,
              px: 1.5,
              py: 0.5,
              borderRadius: '12px',
              fontWeight: '600'
            }}>
              Últimos 30 días
            </Typography>
          </Box>
        </Box>
        <Box 
          sx={{
            height: 250,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.secondary.light}20 100%)`,
            borderRadius: "16px",
            position: "relative",
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          {/* Placeholder para gráfico */}
          <Box 
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "75%",
              bgcolor: "rgba(255,255,255,0.5)",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-end',
              px: 3
            }}
          >
            {[30, 60, 45, 80, 65, 90, 70].map((height, index) => (
              <Box 
                key={index}
                sx={{
                  width: 30,
                  height: `${height}%`,
                  bgcolor: theme.palette.primary.main,
                  borderRadius: '6px 6px 0 0',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '20%',
                    bgcolor: theme.palette.primary.light,
                    borderRadius: '6px 6px 0 0'
                  }
                }}
              />
            ))}
          </Box>
          
          {/* Eje X */}
          <Box 
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "25%",
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-start',
              px: 3,
              pt: 1
            }}
          >
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
              <Typography 
                key={index} 
                variant="caption" 
                sx={{ 
                  width: 30, 
                  textAlign: 'center',
                  color: theme.palette.text.secondary
                }}
              >
                {day}
              </Typography>
            ))}
          </Box>
        </Box>
      </StyledCard>
    </Box>
  );
};

export default HomePage;