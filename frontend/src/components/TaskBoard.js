import React, {useState} from 'react';
import Task from './Task';
import api from '../services/api';
import '../styles/TaskBoard.css'
import EditBoardModal from "./EditBoardModal";

const TaskBoard = ({ board, user, newTask, setNewTask, onDeleteTask, onCreateTask, onUpdateTask, onUpdateBoard, onDeleteBoard }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditBoard = () => {
        setShowEditModal(true);
    }

    const handleSaveBoard = async (boardId, updatedData) => {
        try {
            const updatedBoard = await api.updateTaskBoard(boardId, updatedData);
            // potentially refresh board after update
            setShowEditModal(false);
            onUpdateBoard();
            console.log("Board updated:", updatedBoard);
        } catch (error) {
            console.error("Error updating board:", error);
        }
    };

    const handleDeleteTask = (taskId) => onDeleteTask(board.id, taskId);

    const handleDeleteBoard = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this board?")) return;

        try {
            await api.deleteBoard(id);
            onDeleteBoard(id);  // Prop from Dashboard to update local state
        } catch (err) {
            console.error("Board deletion failed:", err);
        }
    };

    return (
        <div className="task-board">
            <h2>{board.name}</h2>
            <p>{board.description}</p>

            {/* Admins see "Edit Board" button */}
            {user.role === 'ADMIN' && (
                <button onClick={() => handleEditBoard(board.id)}>Edit Board</button>
            )}

            {showEditModal && (
                <EditBoardModal
                board={board}
                onClose={() => setShowEditModal(false)}
                onSave={handleSaveBoard}
                />
            )}

            {/* Render tasks */}
            <div className="tasks">
                {board.tasks.map(task => (
                    <Task
                        key={task.id}
                        task={task}
                        user={user}
                        onDelete={handleDeleteTask}
                        onUpdate={onUpdateTask} // Pass onUpdateTask as a prop
                    />
                ))}
            </div>

            {showCreateForm ? (
                <div className="create-task-form">
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Task Description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    ></textarea>
                    <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                    <button onClick={onCreateTask}>Create Task</button>
                    <button className="cancel-button" onClick={() => setShowCreateForm(false)}>Cancel</button>
                </div>
            ) : (
                <button className="create-button" onClick={() => setShowCreateForm(true)}>Create Task</button>
            )}
            {user.role === 'ADMIN' && Boolean(board.archived) && (
                <button className="delete-button" onClick={() => handleDeleteBoard(board.id)}>
                    Delete Board
                </button>
            )}
        </div>
    );
};

export default TaskBoard;