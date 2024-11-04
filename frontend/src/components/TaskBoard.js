// src/components/TaskBoard.js
import React, {useState} from 'react';
import Task from './Task';
import api from '../services/api';
import '../styles/TaskBoard.css'

const TaskBoard = ({ board, user, newTask, setNewTask, onDeleteTask, onCreateTask }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleDeleteTask = (taskId) => onDeleteTask(board.id, taskId);

    return (
        <div className="task-board">
            <h2>{board.name}</h2>
            <p>{board.description}</p>

            {/* Admins see "Edit Board" button */}
            {user.role === 'ADMIN' && (
                <button onClick={() => handleEditBoard(board.id)}>Edit Board</button>
            )}

            {/* Render tasks */}
            <div className="tasks">
                {board.tasks.map(task => (
                    <Task key={task.id} task={task} user={user} onDelete={handleDeleteTask} />
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
        </div>
    );
};
// Placeholder for Edit Board handler function
const handleEditBoard = (boardId) => {
    console.log("Edit board with ID:", boardId);
    // Implement board editing logic here
};

export default TaskBoard;