import React from 'react';

const Task = ({ task }) => {
    return (
        <div className="task">
            <h3>{task.title}</h3>
            <p>Status: {task.status}</p>
        </div>
    );
};

export default Task;
