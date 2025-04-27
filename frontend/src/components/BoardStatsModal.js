import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import '../styles/BoardStatsModal.css';
import { useTranslation } from 'react-i18next';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d1363e'];

const BoardStatsModal = ({ boardId, onClose, statsOverride }) => {
    const [stats, setStats] = useState(statsOverride || null);
    const [loading, setLoading] = useState(!statsOverride);
    const [error, setError] = useState(null);
    const { t } = useTranslation();


    useEffect(() => {
        if (statsOverride || !boardId) return;
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
    }, [boardId, statsOverride]);

    const statusData = stats ? [
        { name: t('task.statuses.not_started'), value: stats.notStarted },
        { name: t('task.statuses.in_progress'), value: stats.inProgress },
        { name: t('task.statuses.completed'), value: stats.completed },
        { name: t('task.statuses.overdue'), value: stats.overdue },
    ] : [];

    const priorityData = stats ? [
        { name: t('task.priorities.low'), count: stats.lowPriority },
        { name: t('task.priorities.medium'), count: stats.mediumPriority },
        { name: t('task.priorities.high'), count: stats.highPriority },
    ] : [];

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{t('board_stats.title')}</h2>

                {loading && <p>{t('board_stats.loading')}</p>}
                {error && <p>{error}</p>}

                {stats && (
                    <>
                        <ul>
                            <li><strong>{t('board_stats.total_tasks')}:</strong> {stats.totalTasks}</li>
                        </ul>

                        <h4>{t('board_stats.task_status')}</h4>
                        <PieChart width={300} height={200}>
                            <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label>
                                {statusData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>

                        <h4>{t('board_stats.task_priority')}</h4>
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
                    <button onClick={onClose}>{t('board_stats.close')}</button>
                </div>
            </div>
        </div>
    );
};

export default BoardStatsModal;
