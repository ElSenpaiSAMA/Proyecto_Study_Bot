<<<<<<< HEAD
import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const ToDoList = () => {
  return (
    <Box display="flex" height="100vh">
      <Box display="flex" flexDirection="column" flexGrow={1} bgcolor="#f5f5f5" p={3}>
        <Typography variant="h4" sx={{ fontStyle: "italic", borderBottom: "2px solid black", pb: 1 }}>
          To Do List
        </Typography>
        <Box display="flex" justifyContent="space-around" mt={2}>
          <TaskColumn title="To Do" color="red" tasks={3} />
          <TaskColumn title="Doing" color="blue" tasks={2} />
          <TaskColumn title="Done" color="green" tasks={2} />
        </Box>
      </Box>
    </Box>
  );
};

const TaskColumn = ({ title, color, tasks }) => (
  <Box display="flex" flexDirection="column" alignItems="center">
    <Typography variant="h6" sx={{ borderBottom: "1px solid black" }}>
      {title}
    </Typography>
    {[...Array(tasks)].map((_, index) => (
      <Paper
        key={index}
        sx={{
          width: 150,
          height: 30,
          my: 0.5,
          borderRadius: 15,
          borderLeft: `10px solid ${color}`,
          bgcolor: "lightgray",
        }}
      />
    ))}
  </Box>
);

export default ToDoList;
=======
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../styles/ToDoList.css';

const ToDoList = () => {
  const [boards, setBoards] = useState([
    {
      id: 'board-1',
      title: 'Proyecto Principal',
      lists: [
        {
          id: 'list-1',
          title: 'Por Hacer',
          tasks: [
            { id: 'task-1', content: 'Diseñar interfaz' },
            { id: 'task-2', content: 'Configurar API' },
          ],
        },
        {
          id: 'list-2',
          title: 'En Progreso',
          tasks: [
            { id: 'task-3', content: 'Desarrollar componentes' },
          ],
        },
      ],
    },
  ]);

  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [newListTitle, setNewListTitle] = useState('');

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    
    // Si no hay destino o es el mismo lugar, no hacer nada
    if (!destination || 
       (source.droppableId === destination.droppableId && 
        source.index === destination.index)) {
      return;
    }

    // Copia profunda de los tableros
    const updatedBoards = JSON.parse(JSON.stringify(boards));

    // Encontrar el tablero que contiene ambas listas
    const boardIndex = updatedBoards.findIndex(board => 
      board.lists.some(list => list.id === source.droppableId) && 
      board.lists.some(list => list.id === destination.droppableId)
    );

    if (boardIndex === -1) return;

    const board = updatedBoards[boardIndex];
    const sourceList = board.lists.find(list => list.id === source.droppableId);
    const destList = board.lists.find(list => list.id === destination.droppableId);
    const task = sourceList.tasks.find(t => t.id === draggableId);

    // Mover la tarea
    sourceList.tasks.splice(source.index, 1);
    destList.tasks.splice(destination.index, 0, task);

    setBoards(updatedBoards);
  };

  const addTask = (listId, boardId) => {
    if (!newTaskText) return;
    
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        const updatedLists = board.lists.map(list => {
          if (list.id === listId) {
            return {
              ...list,
              tasks: [
                ...list.tasks,
                {
                  id: `task-${Date.now()}`,
                  content: newTaskText
                }
              ]
            };
          }
          return list;
        });
        return { ...board, lists: updatedLists };
      }
      return board;
    });

    setBoards(updatedBoards);
    setNewTaskText('');
  };

  const addList = (boardId) => {
    if (!newListTitle) return;
    
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          lists: [
            ...board.lists,
            {
              id: `list-${Date.now()}`,
              title: newListTitle,
              tasks: []
            }
          ]
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    setNewListTitle('');
  };

  const addBoard = () => {
    if (!newBoardTitle) return;
    
    setBoards([
      ...boards,
      {
        id: `board-${Date.now()}`,
        title: newBoardTitle,
        lists: [
          {
            id: `list-${Date.now()}-1`,
            title: 'Por Hacer',
            tasks: []
          }
        ]
      }
    ]);
    setNewBoardTitle('');
  };

  const deleteTask = (taskId, listId, boardId) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        const updatedLists = board.lists.map(list => {
          if (list.id === listId) {
            return {
              ...list,
              tasks: list.tasks.filter(task => task.id !== taskId)
            };
          }
          return list;
        });
        return { ...board, lists: updatedLists };
      }
      return board;
    });

    setBoards(updatedBoards);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app-container">
        <div className="header">
          <h1>Mis Tableros</h1>
          <div className="add-board-container">
            <input
              type="text"
              placeholder="Nuevo tablero"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
            />
            <button onClick={addBoard}>Crear Tablero</button>
          </div>
        </div>

        <div className="boards-container">
          {boards.map((board) => (
            <div key={board.id} className="board">
              <div className="board-header">
                <h2>{board.title}</h2>
                <div className="add-list-container">
                  <input
                    type="text"
                    placeholder="Nueva lista"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                  />
                  <button onClick={() => addList(board.id)}>+</button>
                </div>
              </div>

              <div className="lists-container">
                {board.lists.map((list) => (
                  <Droppable key={list.id} droppableId={list.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="list"
                      >
                        <div className="list-header">
                          <h3>{list.title}</h3>
                          <span>{list.tasks.length}</span>
                        </div>

                        <div className="tasks-container">
                          {list.tasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="task-card"
                                >
                                  {task.content}
                                  <button 
                                    className="delete-task-btn"
                                    onClick={() => deleteTask(task.id, list.id, board.id)}
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>

                        <div className="add-task-container">
                          <input
                            type="text"
                            placeholder="Nueva tarea"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                          />
                          <div className="task-actions">
                            <button onClick={() => addTask(list.id, board.id)}>Añadir</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default ToDoList;
>>>>>>> fec83c1c2c03013d5db03457093750f5a40a3c58
