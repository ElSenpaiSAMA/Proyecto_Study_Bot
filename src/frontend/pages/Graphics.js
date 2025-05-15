import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { User } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Graphics = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [newGrade, setNewGrade] = useState('');

  const handleAddSubject = () => {
    if (newSubject.trim() === '') return;
    setSubjects([...subjects, { name: newSubject.trim(), grades: [] }]);
    setNewSubject('');
  };

  const handleAddGrade = () => {
    if (!selectedSubject || newGrade === '') return;
    setSubjects(subjects.map(sub =>
      sub.name === selectedSubject
        ? { ...sub, grades: [...sub.grades, parseFloat(newGrade)] }
        : sub
    ));
    setNewGrade('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-700 text-white flex flex-col p-4">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="StudyBot Logo" className="w-12 h-12" />
          <h1 className="text-lg font-bold">STUDYBOT</h1>
        </div>
        <nav className="mt-6 space-y-2">
          <button className="block w-full text-left px-4 py-2 bg-teal-600 rounded">Inicio</button>
          <button className="block w-full text-left px-4 py-2 bg-teal-600 rounded">Calendario</button>
          <button className="block w-full text-left px-4 py-2 bg-teal-400 rounded">Tareas Pendientes</button>
          <button className="block w-full text-left px-4 py-2 bg-teal-600 rounded">Exámenes</button>
          <button className="block w-full text-left px-4 py-2 bg-teal-600 rounded">Gráficos</button>
        </nav>
        <div className="mt-auto flex items-center space-x-2 p-4">
          <User className="w-6 h-6" />
          <span>Jofesina Sanchez</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Gráficos Académicos</h2>

        {/* Formulario para materias y notas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Nueva materia */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-2">Añadir Materia</h3>
            <input
              type="text"
              placeholder="Ej: Matemáticas"
              className="w-full p-2 border border-gray-300 rounded mb-2"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <button onClick={handleAddSubject} className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">
              Añadir
            </button>
          </div>

          {/* Nueva nota */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-2">Añadir Nota</h3>
            <select
              className="w-full p-2 border border-gray-300 rounded mb-2"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Selecciona una materia</option>
              {subjects.map((sub, idx) => (
                <option key={idx} value={sub.name}>{sub.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Nota"
              className="w-full p-2 border border-gray-300 rounded mb-2"
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value)}
            />
            <button onClick={handleAddGrade} className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">
              Añadir Nota
            </button>
          </div>
        </div>

        {/* Gráficos por materia */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {subjects.map((subject, idx) => {
            const data = {
              labels: subject.grades.map((_, i) => `Nota ${i + 1}`),
              datasets: [
                {
                  label: subject.name,
                  data: subject.grades,
                  borderColor: '#48b4ac',
                  backgroundColor: 'rgba(72, 180, 172, 0.2)',
                  fill: true,
                  tension: 0.4,
                },
              ],
            };

            return (
              <div key={idx} className="bg-white p-4 rounded shadow">
                <h4 className="text-center font-semibold mb-2">{subject.name}</h4>
                <Line data={data} />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Graphics;
