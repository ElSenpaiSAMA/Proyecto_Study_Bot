import LoginPage from './pages/LoginPage';
import SchedulePlanner from './pages/SchedulePlanner';
import ToDoList from './pages/ToDoList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<ToDoList/>}/>
        <Route path="/planificador" element={<SchedulePlanner/>}/>
      </Routes>
    </Router>
  );
}

export default App;
