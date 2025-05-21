import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationButton.css';
import logoImage from '../../../assets/white_book_comp.png';

const RegistrationButton = () => {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/');
    };
    return (
        <div className="container">
            <img src={logoImage} alt="Logo" className="logo"/>

            <span className="libramanager">LibraManager</span>

            <span className="library-text">БИБЛИОТЕКА</span>

            <div className="registration-block">
                <p className="registration-text">Нет аккаунта? Зарегистрируйтесь</p>
                
                <button className="register-button" onClick={handleRegisterClick}>Регистрация</button>
            </div>
        </div>
    );
};

export default RegistrationButton;