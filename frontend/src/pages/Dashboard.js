import React, {useEffect, useState} from 'react';
import Navbar from '../components/Navbar';
import TaskBoard from '../components/TaskBoard';
import api from '../services/api';
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Start loading

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
        return <p>Loading data...</p>;
    } else
        return (
            <div>
                <Navbar user={user} />
                {user && user.role === 'ADMIN' && (
                    <button onClick={() => setShowCreateBoard(true)}>+ New Board</button>
                )}
                {showCreateBoard && (
                    <CreateBoardModal
                        onClose={() => setShowCreateBoard(false)}
                        onSave={handleCreateBoard}
                    />
                )}
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
                    />
                ))}

                {/* Conditionally render footer if user is admin */}
                {user && user.role === 'ADMIN' && (
                    <footer className="taskboard-management-bar">
                        <div className="board-filtering">
                            <select value={filter} onChange={handleFilterChange}>
                                <option value="ALL">All Boards</option>
                                <option value="ACTIVE">Active Boards</option>
                                <option value="ARCHIVED">Archived Boards</option>
                            </select>
                        </div>
                        <div className="board-settings">
                            <button>Board Settings</button>
                        </div>
                        <div className="global-task-management">
                            <button onClick={handleShowGlobalStats}>View Global Board Stats</button>
                            {showGlobalStats && (
                                <BoardStatsModal
                                    boardId={null}  // not needed
                                    onClose={() => setShowGlobalStats(false)}
                                    statsOverride={globalStats}  // custom prop
                                />
                            )}
                        </div>
                        <div className="board-statistics">
                            <button>View Board Stats</button>
                        </div>
                    </footer>
                )}
            </div>
        );
};

export default Dashboard;