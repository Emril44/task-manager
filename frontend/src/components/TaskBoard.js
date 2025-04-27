import React, {useState} from 'react';
import Task from './Task';
import api from '../services/api';
import '../styles/TaskBoard.css'
import { useTranslation } from 'react-i18next';
import EditBoardModal from "./EditBoardModal";
import BoardStatsModal from "./BoardStatsModal";

const TaskBoard = ({ board, user, newTask, setNewTask, onDeleteTask, onCreateTask, onUpdateTask, onUpdateBoard, onDeleteBoard, allUsers }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [stats, setStats] = useState(null);
    const { t } = useTranslation();

    const handleEditBoard = () => {
        setShowEditModal(true);
    }

    const handleViewStats = async () => {
        try {
            const res = await api.getBoardStats(board.id);
            setStats(res);
            setShowStatsModal(true);
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    };

    const handleSaveBoard = async (boardId, updatedData) => {
        try {
            const updatedBoard = await api.updateTaskBoard(boardId, updatedData);
            // potentially refresh board after update
            setShowEditModal(false);
            onUpdateBoard();
            console.log("Board updated:", updatedBoard);
        } catch (error) {
            console.error("Error updating board:", error);
        }
    };

    const handleDeleteTask = (taskId) => onDeleteTask(board.id, taskId);

    const handleDeleteBoard = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this board?")) return;

        try {
            await api.deleteBoard(id);
            onDeleteBoard(id);  // Prop from Dashboard to update local state
        } catch (err) {
            console.error("Board deletion failed:", err);
        }
    };

    return (
        <div className="task-board">
            <h2>{board.name}</h2>
            <p>{board.description}</p>

            {user.role === 'ADMIN' && (
                <div className="taskboard-buttons">
                    <button className="view-board-stats-button" onClick={handleViewStats}>
                        {t('taskboard.view_stats')}
                    </button>
                    <button className="edit-board-button" onClick={() => handleEditBoard(board.id)}>
                        {t('taskboard.edit_board')}
                    </button>
                </div>
            )}

            {showStatsModal && (
                <BoardStatsModal boardId={board.id} onClose={() => setShowStatsModal(false)} />
            )}

            {showEditModal && (
                <EditBoardModal
                board={board}
                onClose={() => setShowEditModal(false)}
                onSave={handleSaveBoard}
                />
            )}

            {/* Render tasks */}
            <div className="tasks">
                {board.tasks.map(task => (
                    <Task
                        key={task.id}
                        task={task}
                        user={user}
                        onDelete={handleDeleteTask}
                        onUpdate={onUpdateTask} // Pass onUpdateTask as a prop
                        allUsers={allUsers}
                    />
                ))}
            </div>

            {showCreateForm ? (
                <div className="create-task-form">
                    <input
                        type="text"
                        placeholder={t('taskboard.task_title')}
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    <textarea
                        placeholder={t('taskboard.task_description')}
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    ></textarea>
                    <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                    <select
                        value={newTask.assignedUserId || ''}
                        onChange={(e) => setNewTask({ ...newTask, assignedUserId: parseInt(e.target.value) })}
                    >
                        <option value="">{t('taskboard.select_user')}</option>
                        {allUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.email}
                            </option>
                        ))}
                    </select>

                    <button onClick={onCreateTask}>{t('taskboard.create_task')}</button>
                    <button className="cancel-button" onClick={() => setShowCreateForm(false)}>{t('taskboard.cancel')}</button>
                </div>
            ) : (
                <button className="create-button" onClick={() => setShowCreateForm(true)}>{t('taskboard.create_task')}</button>
            )}
            {user.role === 'ADMIN' && Boolean(board.archived) && (
                <button className="delete-button" onClick={() => handleDeleteBoard(board.id)}>
                    {t('taskboard.delete_board')}
                </button>
            )}
        </div>
    );
};

export default TaskBoard;