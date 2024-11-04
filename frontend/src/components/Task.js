// src/components/Task.js
import React from 'react';
import '../styles/Task.css'

const Task = ({ task, user }) => {
    const canEditTask = user.role === 'ADMIN' || task.assignedUserId === user.id;

    return (
        <div className="task">
            <h3>{task.title}</h3>
            <p>Description: {task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>

            {/* Render "Edit Task" button if user has access */}
            {canEditTask && (
                <button onClick={() => handleEditTask(task.id)}>Edit Task</button>
            )}
        </div>
    );
};

const handleEditTask = (taskId) => {
    console.log("Edit task with ID:", taskId);
    // Implement task editing logic here
};

export default Task;