import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegistrationForm.css';
import DvrIcon from '@mui/icons-material/Dvr';
import { toast } from 'react-toastify';

const RegistrationForm = () => {
    const navigate = useNavigate();

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setPasswordError(true);
            return;
        }

        const userData = {
            full_name: fullname,
            email: email,
            password: password
        };

        try {
            const response = await axios.patch('http://localhost:8080/register', userData);

            toast.success('Регистрация прошла успешно!');
            navigate('/auth');
        } catch (error) {
            toast.error(error.response ? error.response.data : 'Ошибка подключения к серверу');
        }
    };

    return (
        <div className="registration-form-container">
            <DvrIcon style={{ color: '#A44A3F', fontSize: '120' }} />
            <h1 className="title">Регистрация</h1>
            <p className="subtitle">Введите ваши данные для регистрации</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="ФИО"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                    className="form-input"
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input"
                />
                <input
                    type="password"
                    placeholder="Подтверждение пароля"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`form-input ${passwordError ? 'error-border' : ''}`} 
                />
                {passwordError && <span className="error-message">Пароли не совпадают!</span>}
                <button type="submit" className="submit-btn">Регистрация</button>
            </form>
        </div>
    );
};

export default RegistrationForm;