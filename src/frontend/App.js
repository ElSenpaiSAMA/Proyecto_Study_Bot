import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import LoginPage from './pages/LoginPage';
import SchedulePlanner from './pages/SchedulePlanner';
import ToDoList from './pages/ToDoList';
import ProgresoAcademico from './pages/ProgresoAcademico';
import ExamGenerator from './pages/ExamGenerator';
import ConfigPage from './pages/ConfigPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import Sidebar from "./components/Sidebar";
import IAButton from './components/IAButton';
<<<<<<< HEAD
import { ConfigProvider } from '../frontend/context/ConfigContext';

function Layout() {
  const location = useLocation();
<<<<<<< HEAD
  const hideSidebar = location.pathname === "/";
  const hideIAButton = location.pathname === "/chat" || location.pathname === "/";
=======
  const hideSidebar = location.pathname === "/"; 
  const hideIAButton = location.pathname ===  "/chat" || location.pathname === "/";
>>>>>>> origin/main

  return (
    <Box display="flex" height="100vh">
      {!hideSidebar && <Sidebar />}
      <Box flexGrow={1}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/configuracion" element={<ConfigPage />} />
          <Route path="/planificador" element={<SchedulePlanner />} />
=======
import { ConfigProvider } from './context/ConfigContext';
import { useState, useEffect } from 'react';

function Layout() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/";
  const hideIAButton = location.pathname === "/chat" || location.pathname === "/";
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem('scheduleEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }

    const handleStorageChange = () => {
      const saved = localStorage.getItem('scheduleEvents');
      setEvents(saved ? JSON.parse(saved) : []);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflow: "hidden" }}>
      {!hideSidebar && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          overflowY: "auto",
          paddingTop: !hideSidebar ? "64px" : 0,
          boxSizing: "border-box",
          bgcolor: '#f8f9fa'
        }}
      >
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/inicio" element={<HomePage events={events} />} />
          <Route path="/configuracion" element={<ConfigPage />} />
          <Route 
            path="/planificador" 
            element={<SchedulePlanner events={events} setEvents={setEvents} />} 
          />
>>>>>>> fec83c1c2c03013d5db03457093750f5a40a3c58
          <Route path="/tareas" element={<ToDoList />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/progreso" element={<ProgresoAcademico />} />
          <Route path="/examenes" element={<ExamGenerator />} />
        </Routes>
<<<<<<< HEAD
<<<<<<< HEAD
        {!hideIAButton && <IAButton />}
=======
        {!hideIAButton && <IAButton />} 
>>>>>>> origin/main
=======
        {!hideIAButton && <IAButton />}
>>>>>>> fec83c1c2c03013d5db03457093750f5a40a3c58
      </Box>
    </Box>
  );
}

function App() {
  return (
<<<<<<< HEAD
    <ConfigProvider> {/* Envuelve todo con ConfigProvider */}
=======
    <ConfigProvider>
>>>>>>> fec83c1c2c03013d5db03457093750f5a40a3c58
      <Router>
        <Layout />
      </Router>
    </ConfigProvider>
  );
}

export default App;