// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login', {
                email: formData.email,
                password: formData.password
            });
            // Store token and redirect
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            navigate('/dashboard');
        } catch (error) {
            console.error("Login Error:", error.response ? error.response.data : error.message);
            setError('Invalid email or password');
        }

    };

    return (
        <div className="auth-container">
            <div style={{textAlign: 'right', margin: '10px'}}>
                <button onClick={() => i18n.changeLanguage('en')}>ENG</button>
                <button onClick={() => i18n.changeLanguage('uk')}>UKR</button>
            </div>
            <h2>{t('auth.login')}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button type="submit">{t('auth.login')}</button>
                <p>
                    {t('auth.no_account_message')} <a href="/register">{t('auth.register')}</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
