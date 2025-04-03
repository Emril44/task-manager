import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import '../styles/BoardStatsModal.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const BoardStatsModal = ({ boardId, onClose }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!boardId) return;
        const fetchStats = async () => {
            try {
                const data = await api.getBoardStats(boardId);
                setStats(data);
            } catch (err) {
                setError("Failed to load stats.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [boardId]);

    const statusData = stats ? [
        { name: 'Not Started', value: stats.notStarted },
        { name: 'In Progress', value: stats.inProgress },
        { name: 'Completed', value: stats.completed },
    ] : [];

    const priorityData = stats ? [
        { name: 'Low', count: stats.lowPriority },
        { name: 'Medium', count: stats.mediumPriority },
        { name: 'High', count: stats.highPriority },
    ] : [];

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Board Stats</h2>

                {loading && <p>Loading stats...</p>}
                {error && <p>{error}</p>}

                {stats && (
                    <>
                        <ul>
                            <li><strong>Total Tasks:</strong> {stats.totalTasks}</li>
                        </ul>

                        <h4>Task Status</h4>
                        <PieChart width={300} height={200}>
                            <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label>
                                {statusData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>

                        <h4>Task Priority</h4>
                        <BarChart width={350} height={250} data={priorityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </>
                )}

                <div className="modal-actions">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default BoardStatsModal;
