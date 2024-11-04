// src/components/TaskBoard.js
import React, {useState} from 'react';
import Task from './Task';
import api from '../services/api';
import '../styles/TaskBoard.css'

const TaskBoard = ({ board, user, onDeleteTask, setTaskBoards }) => {
    const handleDeleteTask = (taskId) => onDeleteTask(board.id, taskId);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'Pending',
        priority: 1,
        dueDate: '',
    });

    const handleCreateTask = async () => {
        try {
            const taskData = {
                title: newTask.title,
                description: newTask.description,
                status: newTask.status,
                priority: newTask.priority,
                due_date: newTask.dueDate,
                task_board_id: board.id,
                assigned_user: user.id
            };
            console.log(taskData);
            const createdTask = await api.createTask(taskData);
            setTaskBoards((prevTaskBoards) =>
                prevTaskBoards.map((tb) =>
                    tb.id === board.id ? { ...tb, tasks: [...tb.tasks, createdTask] } : tb
                )
            );
            setShowCreateForm(false);
            setNewTask({ title: '', description: '', priority: 1, status: 'Pending', dueDate: '' });
        } catch (error) {
            console.error("Failed to create task:", error);
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
                    <button onClick={handleCreateTask}>Create Task</button>
                    <button className="cancel-button" onClick={() => setShowCreateForm(false)}>Cancel</button>
                </div>
            ) : (
                <button onClick={() => setShowCreateForm(true)}>Create Task</button>
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