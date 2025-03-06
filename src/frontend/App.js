import LoginPage from './pages/LoginPage';
import ToDoList from './pages/ToDoList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<ToDoList/>}/>
      </Routes>
    </Router>
  );
}

export default App;
