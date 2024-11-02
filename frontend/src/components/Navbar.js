import React from 'react';

const Navbar = ({ user }) => {
    return (
        <header className="navbar">
            <div className="navbar-logo">
                <h1>Task Manager</h1>
            </div>
            <div className="navbar-user">
                <span>{user.role === 'admin' ? 'Admin' : 'User'} Dashboard</span>
                <div className="user-avatar">
                    <span>{user.name}</span>
                    <div className="user-status-indicator"></div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
