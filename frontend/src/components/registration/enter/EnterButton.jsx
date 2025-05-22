import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EnterButton.css';
import AutoStoriesIcon from '@mui/icons-material/AutoStories'; 

const EnterButton = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/auth');
    };

    return (
        <div className="container">
            <AutoStoriesIcon style={{ color: '#FFFFFF', fontSize: '120' }} />

            <span className="libramanager">LibraManager</span>

            <span className="library-text">БИБЛИОТЕКА</span>

            <div className="enter-block">
                <p className="enter-text">Есть аккаунт? Войдите</p>
                
                <button className="login-button" onClick={handleLoginClick}>Вход</button>
            </div>
        </div>
    );
};

export default EnterButton;