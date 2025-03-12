import LoginPage from './pages/LoginPage';
import SchedulePlanner from './pages/SchedulePlanner';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/planificador" element={<SchedulePlanner/>}/>
      </Routes>
    </Router>
  );
}

export default App;
