// src/components/Task.js
import React from 'react';
import '../styles/Task.css'

const Task = ({ task }) => {
    return (
        <div className="task">
            <h3>{task.title}</h3>
            <p>Description: {task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
        </div>
    );
};

export default Task;