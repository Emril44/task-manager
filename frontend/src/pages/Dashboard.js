import React from 'react';
import Navbar from '../components/Navbar';
import TaskBoard from '../components/TaskBoard';

const Dashboard = ({ user, taskBoards }) => {

    return (
        <div className="dashboard">
            {/* Navbar */}
            <Navbar user={user} />

            <div className="dashboard-container">
                {/* Main content area */}
                <main className="taskboard-container">
                    {taskBoards.map((board) => (
                        <TaskBoard key={board.id} board={board} />
                    ))}
                </main>
            </div>

            {/* Bottom Bar for Task Board Management */}
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
        </div>
    );
};

export default Dashboard;
