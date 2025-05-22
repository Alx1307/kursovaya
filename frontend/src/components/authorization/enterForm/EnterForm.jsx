import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EnterForm.css';
import DvrIcon from '@mui/icons-material/Dvr'; 

const EnterForm = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = {
            email: email,
            password: password
        };

        try {
            const response = await axios.post('http://localhost:8080/login', userData);

            const { data: { token } } = response;

            localStorage.setItem("authToken", token);

            navigate('/main');
        } catch (error) {
            alert(error.response ? error.response.data : 'Ошибка подключения к серверу');
        }
    };

    return (
        <div className="authorization-form-container">
            <DvrIcon style={{ color: '#A44A3F', fontSize: '120' }} />
            <h1 className="title">Вход в аккаунт</h1>
            <p className="subtitle">Введите ваши данные для входа в аккаунт</p>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="submit-btn">Войти</button>
            </form>
        </div>
    );
};

export default EnterForm;