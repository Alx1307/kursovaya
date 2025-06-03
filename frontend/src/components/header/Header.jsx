import React, { useEffect, useState } from 'react';
import './Header.css';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import ProfileModal from '../modals/ProfileModal';
import { toast } from 'react-toastify';
import api from '../../api/index';

const Header = ({ token }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
  };

  const resetEditing = () => {
    setIsEditing(false);
  };

  const reloadUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await api.get('http://localhost:8080/librarian/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(response.data);
    } catch (error) {
      toast.error('Ошибка загрузки:', error);
    }
  };

  const updateTime = () => {
    setCurrentTime(new Date());
  };

  useEffect(() => {
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });

  useEffect(() => {
    reloadUserData();
  }, [token]);

  return (
    <header className="header">
      {userInfo && (
        <>
          <div className="left-section">
            <PersonIcon className="person-icon" />
            <div className="user-info">
              <div className="full-name">{userInfo.full_name}</div>
              <div className="role-and-email">
                <span className="role">{userInfo.role}</span> • 
                    <span className="email">{userInfo.email}</span>
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
              <IconButton className="IconButton" onClick={handleOpen}>
                <SettingsIcon color="black" fontSize="large" />
              </IconButton>
            </div>
          </div>
        </>
      )}
      <ProfileModal userInfo={userInfo} open={open} handleClose={handleClose} reloadUserData={reloadUserData} resetEditing={resetEditing} />
    </header>
  );
};

export default Header;