// src/components/Task.js
import React, {useState} from 'react';
import '../styles/Task.css'

const Task = ({ task, user, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...task });

    if (!task || !user) return null;

    const canEditTask = user.role === 'ADMIN' || task.assignedUserId === user.id;

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedTask(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = () => {
        onUpdate(task.id, editedTask); // Call the onUpdate prop to update the task
        setIsEditing(false);
    };

    const convertPriority = (priority) => {
        return priority === 1 ? 'Low' : priority === 2 ? 'Medium' : 'High';
    };

    return (
        <div className="task">
            <div className="task-header">
                <span className="task-title">{isEditing ? (
                    <input
                        type="text"
                        name="title"
                        value={editedTask.title || ''}
                        onChange={handleEditChange}
                    />
                ) : (
                    task.title
                )}</span>
            </div>
            <div className="task-content">
                <p>{isEditing ? (
                    <textarea
                        name="description"
                        value={editedTask.description || ''}
                        onChange={handleEditChange}
                    />
                ) : (
                    task.description
                )}</p>
            </div>
            <div className="task-priority">
                <span>Priority: {isEditing ? (
                    <select
                        name="priority"
                        value={editedTask.priority || 1}
                        onChange={handleEditChange}
                    >
                        <option value={1}>Low</option>
                        <option value={2}>Medium</option>
                        <option value={3}>High</option>
                    </select>
                ) : (
                    convertPriority(task.priority)
                )}</span>
            </div>
            <div className="task-due-date">
                <p>Due Date: {isEditing ? (
                    <input
                        type="date"
                        name="dueDate"
                        value={editedTask.dueDate || ''}
                        onChange={handleEditChange}
                    />
                ) : (
                    task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'
                )}</p>
                <span className="task-status">Status: {isEditing ? (
                    <select
                        name="status"
                        value={editedTask.status || 'not-started'}
                        onChange={handleEditChange}
                    >
                        <option value="not started">Not Started</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                ) : (
                    task.status
                )}</span>
            </div>
            <div className="task-actions">
                {canEditTask && (
                    <>
                        {isEditing ? (
                            <>
                                <button className="save-button" onClick={handleSave}>Save</button>
                                <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button className="edit-button" onClick={() => setIsEditing(true)}>Edit Task</button>
                                <button className="delete-button" onClick={() => onDelete(task.id)}>Delete Task</button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Task;