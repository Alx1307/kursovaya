import React from 'react';
import './EnterButton.css';
import logoImage from '../../../assets/white_book_comp.png';

const EnterButton = () => {
    return (
        <div className="container">
            <img src={logoImage} alt="Logo" className="logo"/>

            <span className="libramanager">LibraManager</span>

            <span className="library-text">БИБЛИОТЕКА</span>

            <div className="enter-block">
                <p className="enter-text">Есть аккаунт? Войдите</p>
                
                <button className="login-button">Вход</button>
            </div>
        </div>
    );
};

export default EnterButton;