// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            await api.post('/api/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: "USER"
            });
            navigate('/login'); // Redirect to login page upon successful registration
        } catch (error) {
            setError('Error creating account');
        }

    };

    return (
        <div className="auth-container">
            <div style={{textAlign: 'right', margin: '10px'}}>
                <button onClick={() => i18n.changeLanguage('en')}>ENG</button>
                <button onClick={() => i18n.changeLanguage('uk')}>UKR</button>
            </div>
            <h2>{t('auth.register')}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
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
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button type="submit">{t('auth.register')}</button>
                <p>
                    {t('auth.yes_account_message')} <a href="/login">{t('auth.login')}</a>
                </p>
            </form>
        </div>
    );
};

export default Register;
