import React from "react";
import "../styles/ToDoList.css"; // Importa los estilos CSS

const ToDoList = () => {
  return (
    <div className="container">
      {/* Título */}
      <h1 className="title">To Do List</h1>

      {/* Contenedor principal */}
      <div className="columns">
        {/* Columna To Do */}
        <div className="column">
          <h2 className="column-title">To Do</h2>
          <div className="task">
            <span className="dot red"></span>
            <div className="task-bar"></div>
          </div>
          <div className="task">
            <span className="dot red"></span>
            <div className="task-bar"></div>
          </div>
          <div className="task">
            <span className="dot red"></span>
            <div className="task-bar"></div>
          </div>
          <div className="task">
            <span className="dot red"></span>
            <div className="task-bar"></div>
          </div>
        </div>

        {/* Columna Doing */}
        <div className="column">
          <h2 className="column-title">Doing</h2>
          <div className="task">
            <span className="dot blue"></span>
            <div className="task-bar"></div>
          </div>
          <div className="task">
            <span className="dot blue"></span>
            <div className="task-bar"></div>
          </div>
        </div>

        {/* Columna Done */}
        <div className="column">
          <h2 className="column-title">Done</h2>
          <div className="task">
            <span className="dot green"></span>
            <div className="task-bar"></div>
          </div>
          <div className="task">
            <span className="dot green"></span>
            <div className="task-bar"></div>
          </div>
          <div className="task">
            <span className="dot green"></span>
            <div className="task-bar"></div>
          </div>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="separator"></div>

      {/* Botón inferior */}
      <div className="bottom-button">IA</div>
    </div>
  );
};

export default ToDoList;
