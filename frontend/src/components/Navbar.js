import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Navbar.css';

const Navbar = ({ user }) => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const userRole = user?.role;

    return (
        <header className="navbar">
            <div className="navbar-logo">
                <h1>{t('navbar.task_manager')}</h1>
            </div>

            <div className="navbar-user">
                <span>{userRole === 'ADMIN' ? t('navbar.admin_dashboard') : t('navbar.user_dashboard')}</span>
                <div className="user-avatar">
                    <span>{user?.name}</span>
                    <div className="user-status-indicator"></div>
                </div>
            </div>

            {/* Language switcher */}
            <div className="navbar-lang">
                <button onClick={() => changeLanguage('en')}>ENG</button>
                <button onClick={() => changeLanguage('uk')}>UKR</button>
            </div>
        </header>
    );
};

export default Navbar;
