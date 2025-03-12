import LoginPage from './pages/LoginPage';
import SchedulePlanner from './pages/SchedulePlanner';
import ToDoList from './pages/ToDoList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import { Box } from '@mui/material';

function App() {
  return (
    <Router>  
      <Box display="flex" height="100vh">
        <Sidebar/> 
        <Box flexGrow={1}>
          <Routes>
            <Route path="/" element={<ToDoList/>}/>
            <Route path="/planificador" element={<SchedulePlanner/>}/>
            <Route path="/tareas" element={<ToDoList/>}/>
      </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
