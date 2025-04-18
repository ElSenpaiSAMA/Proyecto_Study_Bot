import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  Divider, 
  Button,
  useTheme,
  Chip,
  Modal,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parseISO, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventIcon from "@mui/icons-material/Event";
import GoogleIcon from "@mui/icons-material/Google";
import AddIcon from "@mui/icons-material/Add";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek: date => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

const SchedulePlanner = ({ userId }) => {
  const [params] = useSearchParams();
  const [googleEvents, setGoogleEvents] = useState([]);
  const [studyEvents, setStudyEvents] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    reminder: false
  });
  const theme = useTheme();
  const [codeUsed, setCodeUsed] = useState(false);

  // Obtener eventos del Google Calendar
  uuseEffect(() => {
    const code = params.get("code");
  
    if (code && !loggedIn && !codeUsed) {
      setCodeUsed(true); // evita que chame mais de uma vez
  
      axios.post("http://localhost:5000/calendar/exchange-code", { code })
        .then((res) => {
          console.log("Eventos recebidos:", res.data);
  
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
          console.error("Erro ao trocar o código:", error.response?.data || error.message);
        });
    }
  }, [params, loggedIn, codeUsed]); 

  // Obtener eventos de estudio
  useEffect(() => {
    if (userId) {
      axios.get(`/study-schedules/${userId}`)
        .then(res => {
          const formattedEvents = res.data.map(event => ({
            title: event.title,
            start: parseISO(event.start_time),
            end: parseISO(event.end_time),
            isStudyEvent: true
          }));
          setStudyEvents(formattedEvents);
        })
        .catch(console.error);
    }
  }, [userId]);

  const allEvents = [...googleEvents, ...studyEvents];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = () => {
    axios.post("/study-schedules/", {
      ...newEvent,
      user_id: userId,
      start_time: newEvent.start_time,
      end_time: newEvent.end_time
    })
    .then(res => {
      setStudyEvents(prev => [...prev, {
        title: res.data.title,
        start: parseISO(res.data.start_time),
        end: parseISO(res.data.end_time),
        isStudyEvent: true
      }]);
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
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Mi Planificador</Typography>
        <Box>
          {!loggedIn && (
            <Button
              variant="outlined"
              onClick={() => window.location.href = "http://localhost:5000/calendar/login"}
              startIcon={<GoogleIcon />}
              sx={{ mr: 2 }}
            >
              Conectar Google
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => setOpenModal(true)}
            startIcon={<AddIcon />}
          >
            Nuevo Evento
          </Button>
        </Box>
      </Box>

      {/* Modal para nuevo evento */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Agregar Nuevo Evento de Estudio</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Título"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Descripción"
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Fecha y hora de inicio"
              type="datetime-local"
              name="start_time"
              value={newEvent.start_time}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
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
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Calendario y lista */}
      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>
        <Box sx={{ flex: 7 }}>
          <Calendar
            localizer={localizer}
            events={allEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "70vh" }}
            culture="es"
            messages={{
              today: "Hoy",
              previous: "Anterior",
              next: "Siguiente",
              month: "Mes",
              week: "Semana",
              day: "Día",
            }}
          />
        </Box>

        <Box sx={{ flex: 3 }}>
          <Typography variant="h5" gutterBottom>
            Próximos Eventos
          </Typography>
          <List sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 1,
            p: 2,
          }}>
            {allEvents
              .sort((a, b) => a.start - b.start)
              .slice(0, 5)
              .map((event, index) => (
                <div key={index}>
                  <ListItem sx={{ py: 1.5, flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {event.title}
                      </Typography>
                      {event.isGoogleEvent && <Chip label="Google" size="small" color="primary" />}
                      {event.isStudyEvent && <Chip label="Estudio" size="small" color="secondary" />}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {format(event.start, "dd/MM/yyyy HH:mm", { locale: es })}
                    </Typography>
                  </ListItem>
                  {index < allEvents.length - 1 && <Divider />}
                </div>
              ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default SchedulePlanner;
