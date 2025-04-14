<<<<<<< HEAD
import React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const SchedulePlanner = () => {
  return (
    <Box display="flex" height="100vh" p={4}>
      {/* Left section: Schedule title and navigation */}
      <Box display="flex" flexDirection="column" flexGrow={1} bgcolor="#f5f5f5" p={3}>
        <Typography variant="h4" sx={{ fontStyle: "italic", borderBottom: "2px solid black", pb: 1 }}>
          Planificador de Horarios
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
=======
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  IconButton,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const SchedulePlanner = ({ events, setEvents }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", description: "", time: "" });
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setOpenModal(true);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time) {
      alert("Por favor, completa el título y la hora.");
      return;
    }
    
    const event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      start: `${selectedDate}T${newEvent.time}:00`,
      alertShown: false,
    };
    
    const updatedEvents = [...events, event];
    setEvents(updatedEvents);
    localStorage.setItem('scheduleEvents', JSON.stringify(updatedEvents));
    window.dispatchEvent(new Event('storage'));
    
    setNewEvent({ title: "", description: "", time: "" });
    setOpenModal(false);
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('scheduleEvents', JSON.stringify(updatedEvents));
    window.dispatchEvent(new Event('storage'));
  };

  const checkUpcomingEvents = () => {
    const now = new Date();
    events.forEach((event) => {
      const eventTime = new Date(event.start);
      const timeDiff = (eventTime - now) / (1000 * 60);
      if (timeDiff > 0 && timeDiff <= 10 && !event.alertShown) {
        alert(`¡Evento próximo! "${event.title}" comienza en ${Math.ceil(timeDiff)} minutos.`);
        setEvents(prevEvents =>
          prevEvents.map(e =>
            e.id === event.id ? { ...e, alertShown: true } : e
          )
        );
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(checkUpcomingEvents, 60000);
    return () => clearInterval(interval);
  }, [events]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <Box sx={{ height: "100%", p: 2 }}>
      <Paper elevation={2} sx={{
        p: 1,
        mb: 2,
        bgcolor: "primary.main",
        color: "white",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <IconButton onClick={handlePrevMonth} sx={{ color: "white" }}>
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontStyle: "italic", fontSize: "1.2rem" }}>
          Agenda - {monthName}
        </Typography>
        <IconButton onClick={handleNextMonth} sx={{ color: "white" }}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Paper>

      <Box sx={{
        height: "calc(100% - 64px)",
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 1,
      }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          height="100%"
          initialDate={currentDate}
          headerToolbar={false}
          dayCellClassNames={(arg) => {
            const isToday =
              arg.date.getDate() === new Date().getDate() &&
              arg.date.getMonth() === new Date().getMonth() &&
              arg.date.getFullYear() === new Date().getFullYear();
            return isToday ? "today-highlight" : "";
          }}
          eventContent={(eventInfo) => (
            <Box sx={{ 
              bgcolor: "primary.main", 
              color: "white", 
              p: "2px 4px", 
              borderRadius: 1, 
              fontSize: "0.7rem",
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {eventInfo.event.title}
            </Box>
          )}
        />
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 350,
          bgcolor: "background.paper",
          p: 3,
          borderRadius: 2,
          boxShadow: 24,
          outline: 'none'
        }}>
          <Typography variant="h6" mb={1} color="primary.main">
            Eventos - {selectedDate}
          </Typography>
          
          <TextField
            label="Título"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            fullWidth
            margin="dense"
            size="small"
          />
          
          <TextField
            label="Descripción"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            fullWidth
            margin="dense"
            size="small"
            multiline
            rows={2}
          />
          
          <TextField
            label="Hora"
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            fullWidth
            margin="dense"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          
          <Button
            onClick={handleAddEvent}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Agregar Evento
          </Button>
          
          <Box mt={2}>
            {selectedDate && events.filter(e => e.start.startsWith(selectedDate)).length > 0 ? (
              events
                .filter(e => e.start.startsWith(selectedDate))
                .map((event) => (
                  <Box
                    key={event.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1,
                      mb: 1,
                      bgcolor: "action.hover",
                      borderRadius: 1
                    }}
                  >
                    <Box>
                      <Typography variant="body2">
                        {event.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.start.split('T')[1].substring(0, 5)}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => handleDeleteEvent(event.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay eventos programados para este día.
              </Typography>
            )}
          </Box>
        </Box>
      </Modal>

      <style jsx global>{`
        .today-highlight {
          background-color: #fffde7 !important;
          border: 2px solid #ffd600 !important;
        }
        .fc-daygrid-day-frame {
          overflow: hidden;
        }
        .fc-col-header-cell {
          background-color: #1976d2 !important;
          color: white !important;
          font-size: 0.8rem;
        }
        .fc-daygrid-day-number {
          font-size: 0.8rem;
          padding: 2px;
        }
        .fc-daygrid-event {
          margin: 1px;
        }
      `}</style>
>>>>>>> fec83c1c2c03013d5db03457093750f5a40a3c58
    </Box>
  );
};

<<<<<<< HEAD
export default SchedulePlanner;
=======
export default SchedulePlanner;
>>>>>>> fec83c1c2c03013d5db03457093750f5a40a3c58
