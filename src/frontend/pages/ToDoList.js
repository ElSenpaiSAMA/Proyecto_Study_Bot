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

  // Función para manejar el drag & drop entre listas (dentro del mismo board)
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Si no hay destino o no hubo movimiento, no hacemos nada
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // Buscar el board que contiene la lista origen y destino
    // Suponemos que ambas listas están en el mismo board (según tu estructura)
    const boardIndex = boards.findIndex(board =>
      board.lists.some(list => list.id === source.droppableId) &&
      board.lists.some(list => list.id === destination.droppableId)
    );
    if (boardIndex === -1) return;

    const board = boards[boardIndex];
    const sourceList = board.lists.find(list => list.id === source.droppableId);
    const destinationList = board.lists.find(list => list.id === destination.droppableId);
    if (!sourceList || !destinationList) return;

    // Clonamos las tareas para manipularlas sin mutar estado directamente
    const sourceTasks = Array.from(sourceList.tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);
    const destinationTasks = Array.from(destinationList.tasks);

    destinationTasks.splice(destination.index, 0, movedTask);

    // Actualizamos las listas dentro del board
    const updatedLists = board.lists.map(list => {
      if (list.id === sourceList.id) return { ...list, tasks: sourceTasks };
      if (list.id === destinationList.id) return { ...list, tasks: destinationTasks };
      return list;
    });

    // Actualizamos el board dentro del estado boards
    const updatedBoards = [...boards];
    updatedBoards[boardIndex] = { ...board, lists: updatedLists };

    setBoards(updatedBoards);

    // Opcional: Aquí podrías hacer llamada a backend para actualizar la posición de las tareas y la lista a la que pertenece movedTask
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

  // Funciones addBoard, addList, addTask, deleteBoard, deleteList, deleteTask, updateBoardTitle, updateListTitle, updateTaskContent
  // ... (los mantengo igual que en tu código original, no los copio aquí para abreviar)

  // Para completar, incluyo las funciones addBoard, addList, addTask, deleteBoard, deleteList, deleteTask, updateBoardTitle, updateListTitle, updateTaskContent tal cual las tienes

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
    <div className="toDoList">
      <h1>TO-DO LIST</h1>

      <div className="add-board">
        <input
          type="text"
          placeholder="Nova board"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
        />
        <button onClick={addBoard}>
          <FiPlus />
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="boards-container">
          {boards.map((board) => (
            <div className="board" key={board.id} style={{ borderColor: board.color }}>
              <div className="board-header" style={{ backgroundColor: board.color }}>
                {editingBoard === board.id ? (
                  <>
                    <input
                      type="text"
                      defaultValue={board.title}
                      onBlur={(e) => updateBoardTitle(board.id, e.target.value)}
                      autoFocus
                    />
                    <button onClick={() => setEditingBoard(null)}>
                      <FiX />
                    </button>
                  </>
                ) : (
                  <>
                    <h2 onClick={() => setEditingBoard(board.id)}>{board.title}</h2>
                    <button onClick={() => deleteBoard(board.id)}>
                      <FiTrash2 />
                    </button>
                  </>
                )}
              </div>

              <div className="lists-container">
                {board.lists.map((list) => (
                  <Droppable droppableId={String(list.id)} key={list.id}>
                    {(provided) => (
                      <div
                        className="list"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <div className="list-header">
                          {editingList === list.id ? (
                            <>
                              <input
                                type="text"
                                defaultValue={list.title}
                                onBlur={(e) =>
                                  updateListTitle(list.id, board.id, e.target.value)
                                }
                                autoFocus
                              />
                              <button onClick={() => setEditingList(null)}>
                                <FiX />
                              </button>
                            </>
                          ) : (
                            <>
                              <h3 onClick={() => setEditingList(list.id)}>{list.title}</h3>
                              <button onClick={() => deleteList(list.id, board.id)}>
                                <FiTrash2 />
                              </button>
                            </>
                          )}
                        </div>

                        <div className="tasks">
                          {list.tasks.map((task, index) => (
                            <Draggable
                              key={String(task.id)}
                              draggableId={String(task.id)}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className="task"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {editingTask === task.id ? (
                                    <>
                                      <input
                                        type="text"
                                        defaultValue={task.content}
                                        onBlur={(e) =>
                                          updateTaskContent(
                                            task.id,
                                            list.id,
                                            board.id,
                                            e.target.value,
                                            task.description
                                          )
                                        }
                                        autoFocus
                                      />
                                      <textarea
                                        defaultValue={task.description}
                                        onBlur={(e) =>
                                          updateTaskContent(
                                            task.id,
                                            list.id,
                                            board.id,
                                            task.content,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <button onClick={() => setEditingTask(null)}>
                                        <FiX />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <p onClick={() => setEditingTask(task.id)}>
                                        {task.content}
                                      </p>
                                      <button
                                        onClick={() => deleteTask(task.id, list.id, board.id)}
                                      >
                                        <FiTrash2 />
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>

                        <div className="add-task">
                          <input
                            type="text"
                            placeholder="Nova tarefa"
                            value={taskInputs[list.id] || ""}
                            onChange={(e) =>
                              setTaskInputs({ ...taskInputs, [list.id]: e.target.value })
                            }
                          />
                          <textarea
                            placeholder="Descrição"
                            value={taskDescriptions[list.id] || ""}
                            onChange={(e) =>
                              setTaskDescriptions({ ...taskDescriptions, [list.id]: e.target.value })
                            }
                          />
                          <button onClick={() => addTask(list.id, board.id)}>
                            <FiPlus />
                          </button>
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}

                <div className="add-list">
                  <input
                    type="text"
                    placeholder="Nova lista"
                    value={newListTitles[board.id] || ""}
                    onChange={(e) =>
                      setNewListTitles({ ...newListTitles, [board.id]: e.target.value })
                    }
                  />
                  <button onClick={() => addList(board.id)}>
                    <FiPlus />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ToDoList;
