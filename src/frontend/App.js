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
import { Home } from '@mui/icons-material';

function Layout() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/"; 
  const hideIAButton = location.pathname === "/"; 
  const hideIAButton2 = location.pathname === "/chat"; 

  return (
    <Box display="flex" height="100vh">
      {!hideSidebar && <Sidebar />} 
      <Box flexGrow={1}>
        <Routes>
           <Route path="/" element={<LoginPage />} />
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/configuracion" element={<ConfigPage />} />
          <Route path="/planificador" element={<SchedulePlanner />} />
          <Route path="/tareas" element={<ToDoList />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/progreso" element={<ProgresoAcademico />} />
          <Route path="/examenes" element={<ExamGenerator />} />
        </Routes>
        {!hideIAButton && <IAButton />} 
        {!hideIAButton2 && <IAButton />} 
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
