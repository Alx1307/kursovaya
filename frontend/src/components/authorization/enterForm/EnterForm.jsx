import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './EnterForm.css';
import DvrIcon from '@mui/icons-material/Dvr';
import { toast } from 'react-toastify';

const EnterForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('tokenExpired') === 'true') {
            toast.error('Срок действия вашего токена истек. Необходима повторная авторизация', {
                position: "top-center",
                autoClose: 5000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [location]);

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

            toast.success('Авторизация прошла успешно!');
            navigate('/main');
        } catch (error) {
            toast.error(error.response ? error.response.data : 'Ошибка подключения к серверу');
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