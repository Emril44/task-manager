// src/components/Task.js
import React, {useState} from 'react';
import '../styles/Task.css'
import api from "../services/api";
import { useTranslation } from 'react-i18next';

const Task = ({ task, user, onDelete, onUpdate, allUsers }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...task });
    const { t } = useTranslation();

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
        if (priority === 1) return t('task.priorities.low');
        if (priority === 2) return t('task.priorities.medium');
        return t('task.priorities.high');
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
      <strong>{t('task.priority')}:</strong>{' '}
        {isEditing ? (
            <select name="priority" value={editedTask.priority || 1} onChange={handleEditChange}>
                <option value={1}>{t('task.priorities.low')}</option>
                <option value={2}>{t('task.priorities.medium')}</option>
                <option value={3}>{t('task.priorities.high')}</option>
            </select>
        ) : (
            convertPriority(task.priority)
        )}
    </span>

                <span>
      <strong>{t('task.status')}:</strong>{' '}
                    {isEditing ? (
                        <select name="status" value={editedTask.status || ''} onChange={handleEditChange}>
                            <option value="not started">{t('task.statuses.not_started')}</option>
                            <option value="in progress">{t('task.statuses.in_progress')}</option>
                            <option value="completed">{t('task.statuses.completed')}</option>
                        </select>
                    ) : (
                        <span className="task-status">
                            {task.status === 'not started' && t('task.statuses.not_started')}
                            {task.status === 'in progress' && t('task.statuses.in_progress')}
                            {task.status === 'completed' && t('task.statuses.completed')}
                            {task.status === 'overdue' && t('task.statuses.overdue')}
                        </span>
                    )}
                </span>

                <span>
      <strong>{t('task.due_date')}:</strong>{' '}
                    {isEditing ? (
                        <input type="date" name="dueDate" value={editedTask.dueDate || ''} onChange={handleEditChange}/>
                    ) : (
                        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'
                    )}
    </span>
            </div>

            {user.role === 'ADMIN' && (
                <div className="task-assign-user">
                    <label><strong>{t('task.assigned_to')}:</strong></label>{' '}
                    {isEditing ? (
                        <select
                            value={editedTask.assignedUserId || ''}
                            onChange={(e) => setEditedTask({...editedTask, assignedUserId: parseInt(e.target.value)})}
                        >
                            <option value="">-- {t('task.select_user')} --</option>
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
                            <button className="save-button" onClick={handleSave}>{t('task.save')}</button>
                            <button className="cancel-button" onClick={() => setIsEditing(false)}>{t('task.cancel')}</button>
                        </>
                    ) : (
                        <>
                            <button className="edit-button" onClick={() => setIsEditing(true)}>{t('task.edit')}</button>
                            <button className="delete-button" onClick={() => onDelete(task.id)}>{t('task.delete')}</button>
                        </>
                    ))}
            </div>
        </div>
    );
};

export default Task;