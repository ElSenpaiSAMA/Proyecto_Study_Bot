import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { FiPlus, FiX, FiTrash2, FiEdit2, FiMoreVertical } from 'react-icons/fi';
import '../styles/ToDoList.css';

// Función auxiliar para reordenar la lista
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Función para mover tareas entre listas
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const ToDoList = () => {
  const [boards, setBoards] = useState([
    {
      id: 'board-1',
      title: 'Proyecto Principal',
      color: '#4f46e5',
      lists: [
        {
          id: 'list-1',
          title: 'Por Hacer',
          tasks: [
            { id: 'task-1', content: 'Diseñar interfaz', description: 'Crear wireframes para la aplicación' },
            { id: 'task-2', content: 'Configurar API', description: 'Establecer endpoints principales' },
          ],
        },
        {
          id: 'list-2',
          title: 'En Progreso',
          tasks: [
            { id: 'task-3', content: 'Desarrollar componentes', description: 'Implementar componentes reutilizables' },
          ],
        },
        {
          id: 'list-3',
          title: 'Completado',
          tasks: [],
        },
      ],
    },
  ]);

  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newListTitle, setNewListTitle] = useState('');
  const [taskInputs, setTaskInputs] = useState({});
  const [taskDescriptions, setTaskDescriptions] = useState({});
  const [editingBoard, setEditingBoard] = useState(null);
  const [editingList, setEditingList] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [boardColors] = useState([
    '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
  ]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Si no hay destino o es la misma posición
    if (!destination) {
      return;
    }

    // Si es el mismo lugar
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Encontrar el tablero que contiene ambas listas
    const boardIndex = boards.findIndex(board =>
      board.lists.some(list => list.id === source.droppableId) &&
      board.lists.some(list => list.id === destination.droppableId)
    );

    if (boardIndex === -1) return;

    const board = boards[boardIndex];
    const sourceList = board.lists.find(list => list.id === source.droppableId);
    const destinationList = board.lists.find(list => list.id === destination.droppableId);

    // Mismo listado - reordenar
    if (source.droppableId === destination.droppableId) {
      const reorderedTasks = reorder(
        sourceList.tasks,
        source.index,
        destination.index
      );

      const updatedBoards = [...boards];
      updatedBoards[boardIndex] = {
        ...board,
        lists: board.lists.map(list => 
          list.id === source.droppableId 
            ? { ...list, tasks: reorderedTasks } 
            : list
        )
      };

      setBoards(updatedBoards);
    } else {
      // Diferentes listados - mover
      const movedTasks = move(
        sourceList.tasks,
        destinationList.tasks,
        source,
        destination
      );

      const updatedBoards = [...boards];
      updatedBoards[boardIndex] = {
        ...board,
        lists: board.lists.map(list => {
          if (list.id === source.droppableId) {
            return { ...list, tasks: movedTasks[source.droppableId] };
          }
          if (list.id === destination.droppableId) {
            return { ...list, tasks: movedTasks[destination.droppableId] };
          }
          return list;
        })
      };

      setBoards(updatedBoards);
    }
  };

  // ... (resto de las funciones permanecen iguales)
  const handleTaskInputChange = (listId, value) => {
    setTaskInputs(prev => ({ ...prev, [listId]: value }));
  };

  const handleTaskDescChange = (listId, value) => {
    setTaskDescriptions(prev => ({ ...prev, [listId]: value }));
  };

  const addTask = (listId, boardId) => {
    const text = taskInputs[listId];
    if (!text) return;

    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        const updatedLists = board.lists.map(list => {
          if (list.id === listId) {
            return {
              ...list,
              tasks: [
                ...list.tasks,
                {
                  id: `task-${uuidv4()}`,
                  content: text,
                  description: taskDescriptions[listId] || ''
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
    setTaskInputs(prev => ({ ...prev, [listId]: '' }));
    setTaskDescriptions(prev => ({ ...prev, [listId]: '' }));
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
              id: `list-${uuidv4()}`,
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

    const randomColor = boardColors[Math.floor(Math.random() * boardColors.length)];

    setBoards([
      ...boards,
      {
        id: `board-${uuidv4()}`,
        title: newBoardTitle,
        color: randomColor,
        lists: [
          {
            id: `list-${uuidv4()}`,
            title: 'Por Hacer',
            tasks: []
          },
          {
            id: `list-${uuidv4()}`,
            title: 'En Progreso',
            tasks: []
          },
          {
            id: `list-${uuidv4()}`,
            title: 'Completado',
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

  const deleteBoard = (boardId) => {
    const updatedBoards = boards.filter(board => board.id !== boardId);
    setBoards(updatedBoards);
  };

  const deleteList = (listId, boardId) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          lists: board.lists.filter(list => list.id !== listId)
        };
      }
      return board;
    });
    setBoards(updatedBoards);
  };

  const updateBoardTitle = (boardId, newTitle) => {
    if (!newTitle) return;
    
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return { ...board, title: newTitle };
      }
      return board;
    });
    
    setBoards(updatedBoards);
    setEditingBoard(null);
  };

  const updateListTitle = (listId, boardId, newTitle) => {
    if (!newTitle) return;
    
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        const updatedLists = board.lists.map(list => {
          if (list.id === listId) {
            return { ...list, title: newTitle };
          }
          return list;
        });
        return { ...board, lists: updatedLists };
      }
      return board;
    });
    
    setBoards(updatedBoards);
    setEditingList(null);
  };

  const updateTaskContent = (taskId, listId, boardId, newContent, newDescription) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        const updatedLists = board.lists.map(list => {
          if (list.id === listId) {
            const updatedTasks = list.tasks.map(task => {
              if (task.id === taskId) {
                return { 
                  ...task, 
                  content: newContent || task.content,
                  description: newDescription || task.description
                };
              }
              return task;
            });
            return { ...list, tasks: updatedTasks };
          }
          return list;
        });
        return { ...board, lists: updatedLists };
      }
      return board;
    });
    
    setBoards(updatedBoards);
    setEditingTask(null);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app-container">
        <div className="header">
          <h1>
            <span className="logo-icon">📋</span>
            Mis Tableros
          </h1>
          <div className="add-board-container">
            <input
              type="text"
              placeholder="Nombre del nuevo tablero"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addBoard()}
            />
            <button className="add-btn" onClick={addBoard}>
              <FiPlus /> Crear Tablero
            </button>
          </div>
        </div>

        <div className="boards-container">
          {boards.map((board) => (
            <div 
              key={board.id} 
              className="board"
              style={{ borderTop: `5px solid ${board.color}` }}
            >
              <div className="board-header">
                {editingBoard === board.id ? (
                  <input
                    type="text"
                    defaultValue={board.title}
                    autoFocus
                    onBlur={(e) => updateBoardTitle(board.id, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && updateBoardTitle(board.id, e.target.value)}
                  />
                ) : (
                  <h2 onClick={() => setEditingBoard(board.id)}>{board.title}</h2>
                )}
                <div className="board-actions">
                  <button 
                    className="icon-btn danger"
                    onClick={() => deleteBoard(board.id)}
                    title="Eliminar tablero"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <div className="add-list-container">
                <input
                  type="text"
                  placeholder="Nombre de la nueva lista"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addList(board.id)}
                />
                <button className="add-btn" onClick={() => addList(board.id)}>
                  <FiPlus /> Añadir Lista
                </button>
              </div>

              <div className="lists-container">
                {board.lists.map((list) => (
                  <Droppable key={list.id} droppableId={list.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                      >
                        <div className="list-header">
                          {editingList === list.id ? (
                            <input
                              type="text"
                              defaultValue={list.title}
                              autoFocus
                              onBlur={(e) => updateListTitle(list.id, board.id, e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && updateListTitle(list.id, board.id, e.target.value)}
                            />
                          ) : (
                            <h3 onClick={() => setEditingList(list.id)}>{list.title}</h3>
                          )}
                          <div className="list-actions">
                            <span className="task-count">{list.tasks.length}</span>
                            <button 
                              className="icon-btn danger"
                              onClick={() => deleteList(list.id, board.id)}
                              title="Eliminar lista"
                            >
                              <FiX />
                            </button>
                          </div>
                        </div>

                        <div className="tasks-container">
                          {list.tasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                >
                                  {editingTask === task.id ? (
                                    <div className="task-edit-form">
                                      <input
                                        type="text"
                                        defaultValue={task.content}
                                        autoFocus
                                        onBlur={(e) => updateTaskContent(task.id, list.id, board.id, e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && updateTaskContent(task.id, list.id, board.id, e.target.value)}
                                      />
                                      <textarea
                                        defaultValue={task.description}
                                        placeholder="Descripción (opcional)"
                                        onBlur={(e) => updateTaskContent(task.id, list.id, board.id, null, e.target.value)}
                                      />
                                      <button 
                                        className="save-btn"
                                        onClick={() => setEditingTask(null)}
                                      >
                                        Guardar
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="task-content" onClick={() => setEditingTask(task.id)}>
                                        <div className="task-title">{task.content}</div>
                                        {task.description && (
                                          <div className="task-description">{task.description}</div>
                                        )}
                                      </div>
                                      <button 
                                        className="icon-btn danger"
                                        onClick={() => deleteTask(task.id, list.id, board.id)}
                                        title="Eliminar tarea"
                                      >
                                        <FiX />
                                      </button>
                                    </>
                                  )}
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
                            value={taskInputs[list.id] || ''}
                            onChange={(e) => handleTaskInputChange(list.id, e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTask(list.id, board.id)}
                          />
                          <textarea
                            placeholder="Descripción (opcional)"
                            value={taskDescriptions[list.id] || ''}
                            onChange={(e) => handleTaskDescChange(list.id, e.target.value)}
                          />
                          <button 
                            className="add-btn"
                            onClick={() => addTask(list.id, board.id)}
                          >
                            <FiPlus /> Añadir Tarea
                          </button>
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