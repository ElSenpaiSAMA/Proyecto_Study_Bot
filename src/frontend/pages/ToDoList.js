import React, { useState, useEffect, useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { FiPlus, FiX, FiTrash2 } from "react-icons/fi";
import "../styles/ToDoList.css";
import { AuthContext } from "../context/AuthContext";

const ToDoList = () => {
  const { userId } = useContext(AuthContext);

  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newListTitles, setNewListTitles] = useState({});
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
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

    const boardIndex = boards.findIndex(board =>
      board.lists.some(list => list.id === source.droppableId) &&
      board.lists.some(list => list.id === destination.droppableId)
    );

    if (boardIndex === -1) return;

    const board = boards[boardIndex];
    const sourceList = board.lists.find(list => list.id === source.droppableId);
    const destinationList = board.lists.find(list => list.id === destination.droppableId);

    if (!sourceList || !destinationList) return;

    const sourceTasks = [...sourceList.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    const destinationTasks = [...destinationList.tasks];
    destinationTasks.splice(destination.index, 0, movedTask);

    const updatedLists = board.lists.map(list => {
      if (list.id === source.droppableId) return { ...list, tasks: sourceTasks };
      if (list.id === destination.droppableId) return { ...list, tasks: destinationTasks };
      return list;
    });

    const updatedBoards = [...boards];
    updatedBoards[boardIndex] = { ...board, lists: updatedLists };
    setBoards(updatedBoards);
  };

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:5000/boards/${userId}`)
      .then(async (res) => {
        const boardsWithLists = await Promise.all(res.data.map(async (board) => {
          const listsRes = await axios.get(`http://localhost:5000/boards/${board.id}/lists/${userId}`);
          const listsWithTasks = await Promise.all(listsRes.data.map(async (list) => {
            const tasksRes = await axios.get(`http://localhost:5000/lists/${list.id}/tasks/${userId}`);
            return { ...list, tasks: tasksRes.data };
          }));
          return { ...board, lists: listsWithTasks };
        }));
        setBoards(boardsWithLists);
      })
      .catch(err => console.error("Erro ao carregar boards:", err));
  }, [userId]);

  const addBoard = async () => {
    if (!newBoardTitle || !userId) return;
    const color = boardColors[Math.floor(Math.random() * boardColors.length)];
    try {
      const res = await axios.post(`http://localhost:5000/boards/${userId}`, {
        title: newBoardTitle,
        color
      });
      const board = res.data;
      board.lists = [];
      setBoards(prev => [...prev, board]);
      setNewBoardTitle("");
    } catch (err) {
      console.error("Erro ao criar board:", err);
    }
  };

  const addList = async (boardId) => {
    const title = newListTitles[boardId];
    if (!title || !userId) return;

    try {
      const res = await axios.post(`http://localhost:5000/boards/${boardId}/lists/${userId}`, {
        title,
        position: 1
      });
      const list = res.data;
      list.tasks = [];

      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId
            ? { ...board, lists: [...board.lists, list] }
            : board
        )
      );

      setNewListTitles((prev) => ({ ...prev, [boardId]: "" }));
    } catch (err) {
      console.error("Erro ao criar lista:", err);
    }
  };

  const addTask = async (listId, boardId) => {
  const content = taskInputs[listId];
  const description = taskDescriptions[listId] || "";
    if (!content || !userId) return;
    try {
      const res = await axios.post(`http://localhost:5000/lists/${listId}/tasks/${userId}`, {
        content,
        description,
        position: 1
      });
      const task = res.data;

      setBoards(prev => prev.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            lists: board.lists.map(list =>
              list.id === listId ? { ...list, tasks: [...list.tasks, task] } : list
            )
          };
        }
        return board;
      }));

      setTaskInputs(prev => ({ ...prev, [listId]: "" }));
      setTaskDescriptions(prev => ({ ...prev, [listId]: "" }));
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
    }
  };

  const deleteBoard = async (boardId) => {
    try {
      await axios.delete(`http://localhost:5000/boards/${boardId}/${userId}`);
      setBoards(prev => prev.filter(board => board.id !== boardId));
    } catch (err) {
      console.error("Erro ao deletar board:", err);
    }
  };

  const deleteList = async (listId, boardId) => {
    try {
      await axios.delete(`http://localhost:5000/boards/${boardId}/lists/${listId}/${userId}`);
      setBoards(prev => prev.map(board =>
        board.id === boardId
          ? { ...board, lists: board.lists.filter(list => list.id !== listId) }
          : board
      ));
    } catch (err) {
      console.error("Erro ao deletar lista:", err);
    }
  };

  const deleteTask = async (taskId, listId, boardId) => {
    try {
      await axios.delete(`http://localhost:5000/lists/${listId}/tasks/${taskId}/${userId}`);
      setBoards(prev => prev.map(board =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map(list =>
                list.id === listId
                  ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
                  : list
              )
            }
          : board
      ));
    } catch (err) {
      console.error("Erro ao deletar tarefa:", err);
    }
  };

  const updateBoardTitle = async (boardId, newTitle) => {
    if (!newTitle || !userId) return;
    try {
      await axios.put(`http://localhost:5000/boards/${boardId}/${userId}`, {
        title: newTitle,
        color: boards.find(b => b.id === boardId)?.color || "#000"
      });
      setBoards(prev => prev.map(board =>
        board.id === boardId ? { ...board, title: newTitle } : board
      ));
      setEditingBoard(null);
    } catch (err) {
      console.error("Erro ao atualizar board:", err);
    }
  };

  const updateListTitle = async (listId, boardId, newTitle) => {
    if (!newTitle || !userId) return;
    try {
      await axios.put(`http://localhost:5000/boards/${boardId}/lists/${listId}/${userId}`, {
        title: newTitle,
        position: 1
      });
      setBoards(prev => prev.map(board =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map(list =>
                list.id === listId ? { ...list, title: newTitle } : list
              )
            }
          : board
      ));
      setEditingList(null);
    } catch (err) {
      console.error("Erro ao atualizar lista:", err);
    }
  };

  const updateTaskContent = async (taskId, listId, boardId, newContent, newDescription) => {
    const currentTask = boards
      .find(b => b.id === boardId)
      ?.lists.find(l => l.id === listId)
      ?.tasks.find(t => t.id === taskId);

    try {
      await axios.put(`http://localhost:5000/lists/${listId}/tasks/${taskId}/${userId}`, {
        content: newContent || currentTask.content,
        description: newDescription || currentTask.description,
        position: currentTask.position
      });

      setBoards(prev => prev.map(board =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map(list =>
                list.id === listId
                  ? {
                      ...list,
                      tasks: list.tasks.map(task =>
                        task.id === taskId
                          ? {
                              ...task,
                              content: newContent || task.content,
                              description: newDescription || task.description
                            }
                          : task
                      )
                    }
                  : list
              )
            }
          : board
      ));

      setEditingTask(null);
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
    }
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
                  value={newListTitles[board.id] || ""}
                  onChange={(e) =>
                    setNewListTitles((prev) => ({ ...prev, [board.id]: e.target.value }))
                  }
                  onKeyPress={(e) =>
                    e.key === "Enter" && addList(board.id)
                  }
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
                            onChange={(e) => setTaskInputs(prev => ({ ...prev, [list.id]: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && addTask(list.id, board.id)}
                          />
                          <textarea
                            placeholder="Descripción (opcional)"
                            value={taskDescriptions[list.id] || ''}
                            onChange={(e) => setTaskDescriptions(prev => ({ ...prev, [list.id]: e.target.value }))}
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
}


export default ToDoList;