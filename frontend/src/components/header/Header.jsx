import React, { useEffect, useState } from 'react';
import './Header.css';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

const Header = () => {
    const userInfo = {
        fullName: 'Иванов Иван Иванович',
        role: 'Администратор',
        email: 'admin@example.com',
    };

    const [currentTime, setCurrentTime] = useState(() => new Date());

    const updateTime = () => {
        setCurrentTime(new Date());
    };

    useEffect(() => {
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = currentTime.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <header className="header">
            <div className="left-section">
                <PersonIcon className="person-icon" />
                <div className="user-info">
                    <div className="full-name">{userInfo.fullName}</div>
                    <div className="role-and-email">
                        <span className="role">{userInfo.role}</span> • <span className="email">{userInfo.email}</span>
                    </div>
                </div>
            </div>
            <div className="right-section">
                <div className="right-group">
                    <div className="clock-date">
                        <div className="current-time">{formattedTime}</div>
                        <div className="current-date">{formattedDate}</div>
                    </div>
                    <div className="vertical-line"></div>
                    <SettingsIcon className="settings-icon" />
                </div>
            </div>
        </header>
    );
};

export default Header;