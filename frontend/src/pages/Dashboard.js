import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TaskBoard from '../components/TaskBoard';
import api from '../services/api';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [taskBoards, setTaskBoards] = useState([]);
    const [loading, setLoading] = useState(true); // New loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Start loading

                const userId = 1; // Example user ID
                const userData = await api.getUser(userId);
                const taskBoardData = await api.getTaskBoards();

                console.log(taskBoardData);

                setUser(userData);
                setTaskBoards(taskBoardData);
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
            {Array.isArray(taskBoards) && taskBoards.length > 0 ? (
                taskBoards.map((board) => (
                    <TaskBoard key={board.id} board={board} />
                ))
            ) : (
                <p>No task boards found.</p>
            )}
        </div>
    );
};

export default Dashboard;