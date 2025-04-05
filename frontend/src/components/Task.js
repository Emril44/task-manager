// src/components/Task.js
import React, {useState} from 'react';
import '../styles/Task.css'
import api from "../services/api";

const Task = ({ task, user, onDelete, onUpdate, allUsers }) => {
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

    const handleSave = async () => {
        console.log(`task.assignedUserId: ${task.assignedUserId}`);
        console.log(`editedTask.assignedUserId: ${editedTask.assignedUserId}`);
        try {
            if (
                user.role === 'ADMIN' &&
                editedTask.assignedUserId &&
                editedTask.assignedUserId !== task.assignedUserId
            ) {
                console.log(`assigning user ${editedTask.assignedUserId}`);
                await api.assignUserToTask(task.id, editedTask.assignedUserId);
            }

            await onUpdate(task.id, editedTask);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save task or assign user:", error);
        }
    };

    const convertPriority = (priority) => {
        return priority === 1 ? 'Low' : priority === 2 ? 'Medium' : 'High';
    };

    return (
        <div className="task">
            <div className="task-header">
                {isEditing ? (
                    <input name="title" value={editedTask.title || ''} onChange={handleEditChange}/>
                ) : (
                    task.title
                )}
            </div>

            <div className="task-content">
                {isEditing ? (
                    <textarea name="description" value={editedTask.description || ''} onChange={handleEditChange}/>
                ) : (
                    task.description
                )}
            </div>

            <div className="task-meta">
    <span>
      <strong>Priority:</strong>{' '}
        {isEditing ? (
            <select name="priority" value={editedTask.priority || 1} onChange={handleEditChange}>
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
            </select>
        ) : (
            convertPriority(task.priority)
        )}
    </span>

                <span>
      <strong>Status:</strong>{' '}
                    {isEditing ? (
                        <select name="status" value={editedTask.status || ''} onChange={handleEditChange}>
                            <option value="not started">Not Started</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    ) : (
                        <span className="task-status">{task.status}</span>
                    )}
    </span>

                <span>
      <strong>Due Date:</strong>{' '}
                    {isEditing ? (
                        <input type="date" name="dueDate" value={editedTask.dueDate || ''} onChange={handleEditChange}/>
                    ) : (
                        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'
                    )}
    </span>
            </div>

            {user.role === 'ADMIN' && (
                <div className="task-assign-user">
                    <label><strong>Assigned to:</strong></label>{' '}
                    {isEditing ? (
                        <select
                            value={editedTask.assignedUserId || ''}
                            onChange={(e) => setEditedTask({...editedTask, assignedUserId: parseInt(e.target.value)})}
                        >
                            <option value="">-- Select User --</option>
                            {allUsers.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.email}
                                </option>
                            ))}
                        </select>
                    ) : (
                        allUsers.find((u) => u.id === task.assignedUserId)?.email || 'Unassigned'
                    )}
                </div>
            )}

            <div className="task-actions">
                {canEditTask &&
                    (isEditing ? (
                        <>
                            <button className="save-button" onClick={handleSave}>Save</button>
                            <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <button className="edit-button" onClick={() => setIsEditing(true)}>Edit Task</button>
                            <button className="delete-button" onClick={() => onDelete(task.id)}>Delete Task</button>
                        </>
                    ))}
            </div>
        </div>
    );
};

export default Task;