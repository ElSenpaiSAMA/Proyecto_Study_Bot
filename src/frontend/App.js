import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import LoginPage from './pages/LoginPage';
import SchedulePlanner from './pages/SchedulePlanner';
import ToDoList from './pages/ToDoList';
import Sidebar from "./components/Sidebar";

function Layout() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/"; // Esconde el Sidebar en la página de login

  return (
    <Box display="flex" height="100vh">
      {!hideSidebar && <Sidebar />} {/*si !hideSideBar es falso, mostre el SideBar*/}
      <Box flexGrow={1}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/planificador" element={<SchedulePlanner />} />
          <Route path="/tareas" element={<ToDoList />} />
        </Routes>
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
