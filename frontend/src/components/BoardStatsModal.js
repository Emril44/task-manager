// src/components/BoardStatsModal.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/BoardStatsModal.css';

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

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Board Stats</h2>

                {loading && <p>Loading stats...</p>}
                {error && <p>{error}</p>}

                {stats && (
                    <ul>
                        <li><strong>Total Tasks:</strong> {stats.totalTasks}</li>
                        <li><strong>Completed:</strong> {stats.completed}</li>
                        <li><strong>In Progress:</strong> {stats.inProgress}</li>
                        <li><strong>Not Started:</strong> {stats.notStarted}</li>
                        <li><strong>High Priority:</strong> {stats.highPriority}</li>
                        <li><strong>Medium Priority:</strong> {stats.mediumPriority}</li>
                        <li><strong>Low Priority:</strong> {stats.lowPriority}</li>
                    </ul>
                )}

                <div className="modal-actions">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default BoardStatsModal;
