import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
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
  const [newListTitle, setNewListTitle] = useState('');
  const [taskInputs, setTaskInputs] = useState({});

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || 
        (source.droppableId === destination.droppableId &&
         source.index === destination.index)) return;

    const updatedBoards = JSON.parse(JSON.stringify(boards));
    const boardIndex = updatedBoards.findIndex(board =>
      board.lists.some(list => list.id === source.droppableId) &&
      board.lists.some(list => list.id === destination.droppableId)
    );
    if (boardIndex === -1) return;

    const board = updatedBoards[boardIndex];
    const sourceList = board.lists.find(list => list.id === source.droppableId);
    const destList = board.lists.find(list => list.id === destination.droppableId);
    const task = sourceList.tasks.find(t => t.id === draggableId);

    sourceList.tasks.splice(source.index, 1);
    destList.tasks.splice(destination.index, 0, task);
    setBoards(updatedBoards);
  };

  const handleTaskInputChange = (listId, value) => {
    setTaskInputs(prev => ({ ...prev, [listId]: value }));
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
                  content: text
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

    setBoards([
      ...boards,
      {
        id: `board-${uuidv4()}`,
        title: newBoardTitle,
        lists: [
          {
            id: `list-${uuidv4()}`,
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
                <button className="delete-board-btn" onClick={() => deleteBoard(board.id)}>Eliminar Tablero</button>
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
                          <button className="delete-list-btn" onClick={() => deleteList(list.id, board.id)}>×</button>
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
                            value={taskInputs[list.id] || ''}
                            onChange={(e) => handleTaskInputChange(list.id, e.target.value)}
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
