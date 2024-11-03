import React from 'react';
import Task from './Task';

const TaskBoard = ({ board }) => {
    return (
        <div>
            <h2>{board.name}</h2>
            <p>{board.description}</p>

            {/* Check if `tasks` exists and is an array before mapping */}
            {Array.isArray(board.tasks) && board.tasks.length > 0 ? (
                board.tasks.map((task) => (
                    <div key={task.id}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                    </div>
                ))
            ) : (
                <p>No tasks available for this board.</p>
            )}
        </div>
    );
};

export default TaskBoard;