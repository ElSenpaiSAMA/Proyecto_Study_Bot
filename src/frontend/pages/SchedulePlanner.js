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

const SchedulePlanner = () => {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("scheduleEvents");
    try {
      const parsedEvents = JSON.parse(savedEvents);
      return Array.isArray(parsedEvents) ? parsedEvents : [];
    } catch (e) {
      return [];
    }
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", description: "", time: "" });
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("scheduleEvents", JSON.stringify(events));
    checkUpcomingEvents();
  }, [events]);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(currentDate);
    }
  }, [currentDate]);

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
    setEvents((prevEvents) => [...prevEvents, event]);
    setNewEvent({ title: "", description: "", time: "" });
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  };

  const checkUpcomingEvents = () => {
    if (!Array.isArray(events)) return;
    const now = new Date();
    events.forEach((event) => {
      const eventTime = new Date(event.start);
      const timeDiff = (eventTime - now) / (1000 * 60);
      if (timeDiff > 0 && timeDiff <= 10 && !event.alertShown) {
        alert(`¡Evento próximo! "${event.title}" comienza en ${Math.ceil(timeDiff)} minutos.`);
        setEvents((prevEvents) =>
          prevEvents.map((e) =>
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
    <Box
      sx={{
        height: "calc(100vh - 64px)", // Resta la altura del Sidebar
        width: "100%",
        bgcolor: "#f0f4f8",
        display: "flex",
        flexDirection: "column",
        p: 2,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 1,
          mb: 2,
          bgcolor: "#1976d2",
          color: "white",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
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

      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          p: 1,
          overflow: "hidden",
        }}
      >
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
            <Box sx={{ bgcolor: "#42a5f5", color: "white", p: "1px", borderRadius: 1, fontSize: "0.7rem" }}>
              <Typography variant="body2">{eventInfo.event.title}</Typography>
            </Box>
          )}
        />
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
            border: "1px solid #1976d2",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" mb={1} sx={{ color: "#1976d2", fontSize: "1.1rem" }}>
            Eventos - {selectedDate}
          </Typography>
          <TextField
            label="Título"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            fullWidth
            margin="dense"
            variant="outlined"
            sx={{ fontSize: "0.9rem" }}
          />
          <TextField
            label="Descripción"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            fullWidth
            margin="dense"
            variant="outlined"
            sx={{ fontSize: "0.9rem" }}
          />
          <TextField
            label="Hora"
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            fullWidth
            margin="dense"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ fontSize: "0.9rem" }}
          />
          <Button
            onClick={handleAddEvent}
            variant="contained"
            color="primary"
            sx={{ mt: 1, bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" }, fontSize: "0.8rem", py: 0.5 }}
          >
            Agregar
          </Button>
          <Box mt={2}>
            {selectedDate &&
            events.filter((e) => e.start.startsWith(selectedDate)).length > 0 ? (
              events
                .filter((e) => e.start.startsWith(selectedDate))
                .map((event) => (
                  <Box
                    key={event.id}
                    display="flex"
                    alignItems="center"
                    mb={1}
                    sx={{ bgcolor: "#e3f2fd", p: 0.5, borderRadius: 1 }}
                  >
                    <Typography sx={{ flexGrow: 1, fontSize: "0.9rem" }}>
                      {event.start.split("T")[1].slice(0, 5)} - {event.title}
                    </Typography>
                    <IconButton
                      onClick={() => handleDeleteEvent(event.id)}
                      sx={{ color: "#d32f2f", p: 0.5 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))
            ) : (
              <Typography sx={{ fontSize: "0.9rem" }}>No hay eventos.</Typography>
            )}
          </Box>
        </Box>
      </Modal>

      <style jsx global>{`
        .today-highlight {
          background-color: #ffeb3b !important;
          border: 2px solid #fbc02d !important;
        }
        .today-highlight:hover {
          background-color: #fdd835 !important;
        }
        .fc {
          max-width: 100%;
          font-size: 0.8rem;
        }
        .fc-daygrid-day {
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        .fc-daygrid-day:hover {
          background-color: #f5f5f5;
        }
        .fc-col-header-cell {
          background-color: #1976d2 !important;
          color: white !important;
          font-size: 0.8rem;
        }
        .fc-daygrid-day-number {
          fontSize: 0.75rem;
        }
      `}</style>
    </Box>
  );
};

export default SchedulePlanner;