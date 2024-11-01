// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login', formData); // Adjust URL as needed
            // Save token or user data to local storage or state here
            navigate('/dashboard'); // Redirect to dashboard upon successful login
        } catch (error) {
            console.error("Login Error:", error.response ? error.response.data : error.message);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
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
                <button type="submit">Login</button>
                <p>
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
