import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegistrationForm.css';
import logoImage from '../../../assets/red_book_comp.png';

const RegistrationForm = () => {
    const navigate = useNavigate();

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('Администратор');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = {
            full_name: fullname,
            email: email,
            password: password,
            role: selectedRole
        };

        try {
            const response = await axios.post('http://localhost:8080/register', userData);
            alert(response.data);
            navigate('/auth');
        } catch (error) {
            alert(error.response ? error.response.data : 'Ошибка подключения к серверу');
        }
    };

    return (
        <div className="registration-form-container">
            <img src={logoImage} alt="Logo" className="logo"/>
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

                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    required
                    className="form-select"
                >
                    <option value="Администратор">Администратор</option>
                    <option value="Библиотекарь">Библиотекарь</option>
                    <option value="Библиограф">Библиограф</option>
                </select>

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
                <button type="submit" className="submit-btn">Регистрация</button>
            </form>
        </div>
    );
};

export default RegistrationForm;