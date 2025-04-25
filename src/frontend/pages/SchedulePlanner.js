import React, { useState, useEffect, useContext } from "react";
import { 
  Box, Typography, List, Divider, Button, useTheme, Chip,
  TextField, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
  Skeleton, keyframes
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parseISO, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import GoogleIcon from "@mui/icons-material/Google";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../context/AuthContext";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek: date => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

// 🚀 Animação de entrada
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SchedulePlanner = () => {
  const { userId } = useContext(AuthContext);
  const [params] = useSearchParams();
  const [googleEvents, setGoogleEvents] = useState([]);
  const [studyEvents, setStudyEvents] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    reminder: false
  });
  const theme = useTheme();
  const [codeUsed, setCodeUsed] = useState(false);
  const [loading, setLoading] = useState(true); // 🚀 Estado de loading

  const cargarEventos = () => {
    if (userId) {
      setLoading(true);
      axios.get(`http://localhost:5000/study-schedules/${userId}`)
        .then(res => {
          const formattedEvents = res.data.map(event => ({
            ...event,
            title: event.title,
            start: parseISO(event.start_time),
            end: parseISO(event.end_time),
            isStudyEvent: true
          }));
          setStudyEvents(formattedEvents);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  useEffect(() => {
    cargarEventos();
  }, [userId]);

  useEffect(() => {
    const code = params.get("code");
    if (code && !loggedIn && !codeUsed) {
      setCodeUsed(true);
      axios.post("http://localhost:5000/calendar/exchange-code", { code })
        .then((res) => {
          const formattedEvents = res.data.map((event) => ({
            title: event.summary || "Sin título",
            start: parseISO(event.start),
            end: parseISO(event.end || event.start),
            allDay: event.allDay,
            isGoogleEvent: true
          }));
          setGoogleEvents(formattedEvents);
          setLoggedIn(true);
          localStorage.setItem("isGoogleLogged", "true");
        })
        .catch((error) => {
          console.error("Erro ao trocar o código:", error.response?.data || error.message);
        });
    }
  }, [params, loggedIn, codeUsed]);
  
  // 👉 Novo useEffect para carregar eventos automaticamente se já logado
  useEffect(() => {
    const isGoogleLogged = localStorage.getItem("isGoogleLogged");
    if (isGoogleLogged && !loggedIn && !codeUsed) {
      axios.get("http://localhost:5000/calendar/get-events")
        .then((res) => {
          const formattedEvents = res.data.map((event) => ({
            title: event.summary || "Sin título",
            start: parseISO(event.start),
            end: parseISO(event.end || event.start),
            allDay: event.allDay,
            isGoogleEvent: true
          }));
          setGoogleEvents(formattedEvents);
          setLoggedIn(true);
        })
        .catch((error) => {
          console.error("Erro ao buscar eventos:", error.response?.data || error.message);
          localStorage.removeItem("isGoogleLogged"); // Se der erro, remove
        });
    }
  }, [loggedIn, codeUsed]);

  const allEvents = [...googleEvents, ...studyEvents];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!userId) {
      alert("Usuário não autenticado");
      return;
    }

    axios.post("http://localhost:5000/study-schedules/", {
      ...newEvent,
      user_id: userId,
    })
    .then(res => {
      cargarEventos(); // Despues de guardar en en banco de datos, llama la función para carregar los eventos otra vez
      setOpenModal(false);
      setNewEvent({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        reminder: false
      });
    })
    .catch(console.error);
  };

  return (
    <Box sx={{ 
      p: 4,
      maxWidth: { xl: 1800 },
      margin: '0 auto',
      minHeight: '100vh',
      animation: `${fadeIn} 0.5s ease-out` // 🚀 Animação na página toda
    }}>
      {/* 🚀 Cabeçalho modernizado */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Typography variant="h4" sx={{ 
          background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          fontSize: { xs: '1.8rem', md: '2.4rem' }
        }}>
          Mi Planificador
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {!loggedIn && (
            <Button
              variant="outlined"
              onClick={() => window.location.href = "http://localhost:5000/calendar/login"}
              startIcon={<GoogleIcon />}
              sx={{ 
                borderRadius: '50px',
                textTransform: 'none',
                px: 3,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[2]
                },
                transition: 'all 0.2s'
              }}
            >Conectar Google</Button>
          )}
          <Button
            variant="contained"
            onClick={() => setOpenModal(true)}
            startIcon={<AddIcon />}
            sx={{
              borderRadius: '50px',
              textTransform: 'none',
              px: 3,
              boxShadow: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4]
              },
              transition: 'all 0.2s'
            }}
          >Nuevo Evento</Button>
        </Box>
      </Box>

      {/* 🚀 Modal moderno */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            width: '100%',
            maxWidth: '500px',
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[24]
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.5rem', 
          fontWeight: 600,
          background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Agregar Nuevo Evento
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField 
              variant="outlined"
              label="Título" 
              name="title" 
              value={newEvent.title} 
              onChange={handleInputChange} 
              fullWidth 
            />
            <TextField
              variant="outlined"
              label="Descripción"
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              variant="outlined"
              label="Fecha y hora de inicio"
              type="datetime-local"
              name="start_time"
              value={newEvent.start_time}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              variant="outlined"
              label="Fecha y hora de fin"
              type="datetime-local"
              name="end_time"
              value={newEvent.end_time}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setOpenModal(false)}
            sx={{ borderRadius: '8px', px: 3 }}
          >Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ 
              borderRadius: '8px',
              px: 3,
              background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
              '&:hover': {
                opacity: 0.9
              }
            }}
          >Guardar</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ 
        display: "flex", 
        gap: 4, 
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: 'center', md: 'flex-start' }
      }}>
        <Box sx={{ flex: 7, width: '100%' }}>
          {loading ? (
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height="70vh" 
              sx={{ borderRadius: 3 }} 
            />
          ) : (
            <Calendar
              localizer={localizer}
              events={allEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ 
                height: "70vh",
                borderRadius: '16px',
                boxShadow: theme.shadows[3],
                padding: '16px',
                backgroundColor: theme.palette.background.paper
              }}
              culture="es"
              date={currentDate}
              view={currentView}
              onNavigate={(date) => setCurrentDate(date)}
              onView={(view) => setCurrentView(view)}
              messages={{
                today: "Hoy",
                previous: "Anterior",
                next: "Siguiente",
                month: "Mes",
                week: "Semana",
                day: "Día"
              }}
              views={["month", "week", "day"]}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: event.isGoogleEvent 
                    ? '#4285F4' 
                    : event.isStudyEvent 
                      ? theme.palette.secondary.main 
                      : theme.palette.primary.main,
                  borderRadius: '8px',
                  color: 'white',
                  border: 'none',
                  boxShadow: theme.shadows[2]
                }
              })}
            />
          )}
        </Box>

        {/* 🚀 Barra lateral de eventos estilizada */}
        <Box sx={{ 
          flex: 3, 
          width: '100%', 
          maxWidth: { md: '400px' },
          animation: `${fadeIn} 0.5s ease-out 0.2s` 
        }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, ml: 1 }}>
            Próximos Eventos
          </Typography>
          {loading ? (
            Array(5).fill().map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                height={80}
                sx={{ 
                  mb: 2, 
                  borderRadius: 2 
                }}
              />
            ))
          ) : (
            <List sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              p: 2,
              boxShadow: theme.shadows[2]
            }}>
              {allEvents
                .sort((a, b) => a.start - b.start)
                .slice(0, 5)
                .map((event, index) => (
                  <Box 
                    key={index}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: theme.palette.grey[100],
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[2]
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {event.title}
                      </Typography>
                      {event.isGoogleEvent && (
                        <Chip 
                          label="Google" 
                          size="small" 
                          sx={{ 
                            background: '#4285F4',
                            color: 'white',
                            fontWeight: 500
                          }} 
                        />
                      )}
                      {event.isStudyEvent && (
                        <Chip 
                          label="StudyBot" 
                          size="small" 
                          sx={{ 
                            background: theme.palette.secondary.main,
                            color: 'white',
                            fontWeight: 500
                          }} 
                        />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {format(event.start, "dd/MM/yyyy HH:mm", { locale: es })}
                    </Typography>
                  </Box>
                ))}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SchedulePlanner;