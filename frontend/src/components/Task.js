// src/components/Task.js
import React from 'react';
import '../styles/Task.css'

const Task = ({ task, user, onDelete }) => {
    const canEditTask = user.role === 'ADMIN' || task.assignedUserId === user.id;

    return (
        <div className="task">
            <div className="task-header">
                <span className="task-title">{task.title}</span>
                <span className="task-status">Status: {task.status}</span>
            </div>
            <div className="task-content">
                <p>Description: {task.description}</p>
            </div>
            <div className="task-priority">
                <span>Priority: {task.priority}</span>
            </div>
            <div className="task-due-date">
                <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
            <div className="task-actions">
                {canEditTask && (
                    <>
                        <button className="edit-button" onClick={() => handleEditTask(task.id)}>Edit Task</button>
                        <button className="delete-button" onClick={() => onDelete(task.id)}>Delete Task</button>
                    </>
                )}
            </div>
        </div>
    );
};

const handleEditTask = (taskId) => {
    console.log("Edit task with ID:", taskId);
    // Implement task editing logic here
};

export default Task;