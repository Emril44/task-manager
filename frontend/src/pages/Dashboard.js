import React, {useEffect, useState} from 'react';
import Navbar from '../components/Navbar';
import TaskBoard from '../components/TaskBoard';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import '../styles/Dashboard.css'
import CreateBoardModal from "../components/CreateBoardModal";
import BoardStatsModal from "../components/BoardStatsModal";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [taskBoards, setTaskBoards] = useState([]);
    const [showCreateBoard, setShowCreateBoard] = useState(false);
    const [loading, setLoading] = useState(true); // New loading state
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'Pending',
        priority: 1,
        dueDate: '',
    });
    const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, ARCHIVED
    const [showGlobalStats, setShowGlobalStats] = useState(false);
    const [globalStats, setGlobalStats] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const { t } = useTranslation();


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Start loading

                const res = await api.getAllUsers();
                console.log("Fetched users:", res);
                setAllUsers(res);

                const userId = localStorage.getItem('userId');

                if (!userId) {
                    console.error("User ID not found, please log in again.");
                    return;
                }

                const userData = await api.getUser(userId);
                fetchBoards();
                setUser(userData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchData();
    }, []);

    const fetchBoards = async () => {
        try {
            const taskBoardData = await api.getTaskBoards();
            const boardsWithTasks = await Promise.all(
                taskBoardData.map(async (board) => {
                    const tasks = await api.getTasksByBoardId(board.id);
                    return { ...board, tasks }; // Add tasks to each board object
                })
            );
            setTaskBoards(boardsWithTasks);
        } catch (err) {
            console.error("Failed to refresh boards: ", err);
        }
    }

    const handleDeleteTask = async (boardId, taskId) => {
        try {
            await api.deleteTask(taskId);
            setTaskBoards((prevTaskBoards) =>
                prevTaskBoards.map((board) =>
                    board.id === boardId
                        ? { ...board, tasks: board.tasks.filter(task => task.id !== taskId) }
                        : board
                )
            );
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const handleCreateTask = async (boardId) => {
        try {
            const taskData = {
                title: newTask.title,
                description: newTask.description,
                status: newTask.status,
                priority: newTask.priority,
                due_date: newTask.dueDate,
                task_board_id: boardId,
                assigned_user: user.id
            };
            console.log(taskData);
            const createdTask = await api.createTask(taskData);
            console.log(createdTask);
            setTaskBoards((prevTaskBoards) =>
                prevTaskBoards.map((tb) =>
                    tb.id === boardId ? { ...tb, tasks: [...tb.tasks, createdTask] } : tb
                )
            );
            setNewTask({ title: '', description: '', priority: 1, status: 'Pending', dueDate: '' });
            console.log(taskBoards);
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    };

    const handleCreateBoard = async (formData) => {
        try {
            await api.createTaskBoard(formData);
            await fetchBoards(); // Refresh
        } catch (error) {
            console.error("Failed to create board:", error);
        }
    };

    const handleUpdateTask = async (taskId, updatedTaskData, boardId) => {
        try {
            const updatedTask = await api.updateTask(taskId, updatedTaskData);
            setTaskBoards(prevTaskBoards =>
                prevTaskBoards.map(board =>
                    board.id === boardId
                        ? {
                            ...board,
                            tasks: board.tasks.map(task =>
                                task.id === taskId ? updatedTask : task
                            )
                        }
                        : board
                )
            );
            console.log("Task updated:", updatedTask);
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const handleFilterChange = async (e) => {
        const selected = e.target.value;
        setFilter(selected);

        try {
            let boards = [];
            if (selected === 'ACTIVE') {
                boards = await api.getActiveBoards();
            } else if (selected === 'ARCHIVED') {
                boards = await api.getArchivedBoards();
            } else {
                boards = await api.getTaskBoards();
            }

            const boardsWithTasks = await Promise.all(
                boards.map(async (board) => {
                    const tasks = await api.getTasksByBoardId(board.id);
                    return { ...board, tasks };
                })
            );

            setTaskBoards(boardsWithTasks);
        } catch (err) {
            console.error("Filtering boards failed:", err);
        }
    };

    const handleDeleteBoard = (boardId) => {
        setTaskBoards((prevBoards) => prevBoards.filter(board => board.id !== boardId));
    };

    const handleShowGlobalStats = async () => {
        try {
            const data = await api.getGlobalStats();
            setGlobalStats(data);
            setShowGlobalStats(true);
        } catch (e) {
            console.error("Failed to fetch global stats", e);
        }
    };

    if (!user) {
        return <p>{t('dashboard.loading')}</p>;
    } else
        return (
            <div>
                <Navbar user={user} />
                {user && user.role === 'ADMIN' && (
                    <div className="admin-toolbar">
                        <div className="left-actions">
                            <button className="create-board-button" onClick={() => setShowCreateBoard(true)}>+ {t('dashboard.new_board')}</button>
                            <div className="board-filtering">
                                <select value={filter} onChange={handleFilterChange}>
                                    <option value="ALL">{t('dashboard.all_boards')}</option>
                                    <option value="ACTIVE">{t('dashboard.active_boards')}</option>
                                    <option value="ARCHIVED">{t('dashboard.archived_boards')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="right-actions">
                            <button className="view-global-stats-button" onClick={handleShowGlobalStats}>
                                {t('dashboard.view_global_stats')}
                            </button>
                        </div>
                    </div>
                )}

                {showGlobalStats && (
                    <BoardStatsModal
                        boardId={null}
                        onClose={() => setShowGlobalStats(false)}
                        statsOverride={globalStats}
                    />
                )}

                {showCreateBoard && (
                    <CreateBoardModal
                        onClose={() => setShowCreateBoard(false)}
                        onSave={handleCreateBoard}
                    />
                )}

                <div className="taskboard-container">
                {taskBoards.map((board) => (
                    <TaskBoard
                        key={board.id}
                        board={board}
                        user={user}
                        newTask={newTask}
                        setNewTask={setNewTask}
                        onDeleteTask={handleDeleteTask}
                        onCreateTask={() => handleCreateTask(board.id)}
                        onUpdateTask={(taskId, updatedTaskData) => handleUpdateTask(taskId, updatedTaskData, board.id)}  // Pass board ID
                        onUpdateBoard={fetchBoards}
                        onDeleteBoard={handleDeleteBoard}
                        allUsers={allUsers}
                    />
                ))}
                </div>
            </div>
        );
};

export default Dashboard;