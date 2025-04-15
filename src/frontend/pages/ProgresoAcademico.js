import React from 'react';
import '../styles/ProgresoAcademico.css';

const ProgresoAcademico = () => {
  return (
    <div className="container">
      <div>
        <h1 className="title">Progreso Académico</h1>
      </div>
      
      <div className="grid">
        {/* Calificaciones */}
        <div className="chart-container">
          <p className="chart-label">Calificaciones</p>
          <div className="chart">
            <div className="axis-y"></div>
            <div className="axis-x"></div>
            
            <div className="bar-chart">
              <div className="bar-group">
                <div className="teal-bar" style={{height: '120px'}}></div>
                <div className="red-bar" style={{height: '80px'}}></div>
              </div>
              
              <div className="bar-group">
                <div className="teal-bar" style={{height: '100px'}}></div>
                <div className="red-bar" style={{height: '90px'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rendimiento */}
        <div className="chart-container">
          <p className="chart-label">Rendimiento</p>
          <div className="chart">
            <div className="axis-y"></div>
            <div className="axis-x"></div>
            
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline 
                points="10,70 50,40 90,40" 
                fill="none" 
                stroke="#4DB6AC" 
                strokeWidth="3"
              />
              <polyline 
                points="10,80 50,55 90,65" 
                fill="none" 
                stroke="#E57373" 
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
        
        {/* Tiempo dedicado */}
        <div className="chart-container">
          <p className="chart-label">Tiempo dedicado</p>
          <div className="chart">
            <div className="axis-y"></div>
            <div className="axis-x"></div>
            
            <div className="bar-chart">
              <div className="bar-group">
                <div className="teal-bar" style={{height: '110px'}}></div>
                <div className="red-bar" style={{height: '70px'}}></div>
              </div>
              
              <div className="bar-group">
                <div className="teal-bar" style={{height: '90px'}}></div>
                <div className="red-bar" style={{height: '85px'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Asistencia a clases */}
        <div className="chart-container">
          <p className="chart-label">Asistencia a clases</p>
          <div className="chart">
            <div className="axis-y"></div>
            <div className="axis-x"></div>
            
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline 
                points="10,70 50,40 90,40" 
                fill="none" 
                stroke="#4DB6AC" 
                strokeWidth="3"
              />
              <polyline 
                points="10,85 50,60 90,70" 
                fill="none" 
                stroke="#E57373" 
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgresoAcademico;
