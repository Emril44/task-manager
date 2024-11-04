import React from 'react';
import '../styles/Navbar.css';

const Navbar = ({ user }) => {
    const userRole = user?.role;
    return (
        <header className="navbar">
            <div className="navbar-logo">
                <h1>Task Manager</h1>
            </div>
            <div className="navbar-user">
                <span>{userRole === 'ADMIN' ? 'Admin' : 'User'} Dashboard</span>
                <div className="user-avatar">
                    <span>{user.name}</span>
                    <div className="user-status-indicator"></div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
