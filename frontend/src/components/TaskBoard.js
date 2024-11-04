// src/components/TaskBoard.js
import React from 'react';
import Task from './Task';
import '../styles/TaskBoard.css'

const TaskBoard = ({ board, user }) => {
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
                    <Task key={task.id} task={task} user={user} />
                ))}
            </div>
        </div>
    );
};

// Placeholder for Edit Board handler function
const handleEditBoard = (boardId) => {
    console.log("Edit board with ID:", boardId);
    // Implement board editing logic here
};

export default TaskBoard;