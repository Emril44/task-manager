// src/components/TaskBoard.js
import React from 'react';
import Task from './Task';
import '../styles/TaskBoard.css'

const TaskBoard = ({ board }) => {
    return (
        <div className="taskboard">
            <h2>{board.name}</h2>
            <p>{board.description}</p>

            <div className="tasks-container">
                {board.tasks && board.tasks.length > 0 ? (
                    board.tasks.map((task) => (
                        <Task key={task.id} task={task} />
                    ))
                ) : (
                    <p>No tasks found for this board.</p>
                )}
            </div>
        </div>
    );
};

export default TaskBoard;