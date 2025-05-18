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
import { Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Add, School, InsertChart } from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graphics = () => {
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [newGrade, setNewGrade] = useState('');

  const addSubject = (e) => {
    e.preventDefault();
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const addGrade = (e) => {
    e.preventDefault();
    if (selectedSubject && newGrade) {
      const gradeValue = parseFloat(newGrade);
      if (!isNaN(gradeValue) && gradeValue >= 0 && gradeValue <= 10) {
        const newGradeEntry = {
          subject: selectedSubject,
          grade: gradeValue,
          date: new Date().toLocaleDateString()
        };
        setGrades([...grades, newGradeEntry]);
        setNewGrade('');
      }
    }
  };

  const getSubjectGrades = (subject) => {
    return grades
      .filter(grade => grade.subject === subject)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const calculateAverage = (subject) => {
    const subjectGrades = getSubjectGrades(subject);
    if (subjectGrades.length === 0) return 0;
    const sum = subjectGrades.reduce((total, grade) => total + grade.grade, 0);
    return (sum / subjectGrades.length).toFixed(2);
  };

  const chartData = {
    labels: getSubjectGrades(selectedSubject).map(grade => grade.date),
    datasets: [{
      label: `Notas de ${selectedSubject}`,
      data: getSubjectGrades(selectedSubject).map(grade => grade.grade),
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: 'black' }}>
      <h1 style={{ display: 'flex', alignItems: 'center' }}>
        <School style={{ marginRight: '10px', color: '#1976d2' }} />
        Seguimiento Académico
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Formulario para agregar materias */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center' }}>
            <Add style={{ marginRight: '10px', color: '#1976d2' }} />
            Crear Nueva Materia
          </h2>
          <form onSubmit={addSubject}>
            <TextField
              fullWidth
              label="Nombre de la materia"
              variant="outlined"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              style={{ marginBottom: '15px' }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: '#1976d2', color: 'white' }}
            >
              Agregar Materia
            </Button>
          </form>
        </div>

        {/* Formulario para agregar calificaciones */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center' }}>
            <InsertChart style={{ marginRight: '10px', color: '#1976d2' }} />
            Registrar Calificación
          </h2>
          <form onSubmit={addGrade}>
            <FormControl fullWidth style={{ marginBottom: '15px' }}>
              <InputLabel style={{ color: 'black' }}>Materia</InputLabel>
              <Select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                required
                label="Materia"
              >
                {subjects.map((subject, index) => (
                  <MenuItem key={index} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label="Calificación (0-10)"
              inputProps={{ min: 0, max: 10, step: 0.1 }}
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value)}
              style={{ marginBottom: '15px' }}
              required
            />

            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: '#1976d2', color: 'white' }}
            >
              Registrar Calificación
            </Button>
          </form>
        </div>
      </div>

      {/* Gráfico de progreso */}
      {selectedSubject && getSubjectGrades(selectedSubject).length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h2>Progreso en {selectedSubject}</h2>
          <div style={{ height: '300px' }}>
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }}
            />
          </div>
          <p style={{ marginTop: '10px', fontSize: '16px' }}>
            <strong>Promedio:</strong> {calculateAverage(selectedSubject)}
          </p>
        </div>
      )}

      {/* Resumen de materias */}
      {subjects.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '15px' }}>Resumen de Materias</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {subjects.map((subject, index) => (
              <div
                key={index}
                style={{
                  padding: '15px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  textAlign: 'center',
                  backgroundColor: subject === selectedSubject ? 'rgba(25, 118, 210, 0.1)' : 'white'
                }}
              >
                <h3 style={{ margin: '0 0 10px 0' }}>{subject}</h3>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {calculateAverage(subject)}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {getSubjectGrades(subject).length} calificaciones
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Graphics;
