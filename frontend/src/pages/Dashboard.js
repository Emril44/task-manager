import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TaskBoard from '../components/TaskBoard';
import api from '../services/api';
import '../styles/Dashboard.css'

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [taskBoards, setTaskBoards] = useState([]);
    const [loading, setLoading] = useState(true); // New loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Start loading

                const userId = localStorage.getItem('userId');
                console.log(userId);

                if (!userId) {
                    console.error("User ID not found, please log in again.");
                    return;
                }

                const userData = await api.getUser(userId);
                const taskBoardData = await api.getTaskBoards();

                // Fetch tasks for each board and attach them to the board data
                const boardsWithTasks = await Promise.all(
                    taskBoardData.map(async (board) => {
                        const tasks = await api.getTasksByBoardId(board.id);
                        return { ...board, tasks }; // Add tasks to each board object
                    })
                );

                console.log(userData);
                console.log(taskBoardData);

                setUser(userData);
                setTaskBoards(boardsWithTasks);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Loading data...</p>;
    } else
        return (
            <div>
                <Navbar user={user} />
                {taskBoards.map((board) => (
                    <TaskBoard key={board.id} board={board} user={user}/>
                ))}

                {/* Conditionally render footer if user is admin */}
                {user && user.role === 'ADMIN' && (
                    <footer className="taskboard-management-bar">
                        <div className="board-filtering">
                            <select>
                                <option value="active">Active Boards</option>
                                <option value="archived">Archived</option>
                                <option value="highPriority">High Priority</option>
                            </select>
                        </div>
                        <div className="board-settings">
                            <button>Board Settings</button>
                        </div>
                        <div className="global-task-management">
                            <button>Manage All Tasks</button>
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