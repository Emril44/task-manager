import React from 'react';
import Task from './Task';

const TaskBoard = ({ board }) => {
    return (
        <div className="task-board">
            <h2>{board.name}</h2>
            <div className="tasks-list">
                {board.tasks.map((task) => (
                    <Task key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
};

export default TaskBoard;
