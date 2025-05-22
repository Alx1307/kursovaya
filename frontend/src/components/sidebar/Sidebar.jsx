import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import logoImage from '../../assets/white_book_comp.png';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BookIcon from '@mui/icons-material/Book';
import LocalLibrary from '@mui/icons-material/LocalLibrary';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LogoutIcon from '@mui/icons-material/Logout';

const menuItems = [
    { icon: HomeIcon, title: 'Главная', link: '/main' },
    { icon: LibraryBooksIcon, title: 'Выдачи', link: '/issues' },
    { icon: BookIcon, title: 'Книги', link: '/books' },
    { icon: LocalLibrary, title: 'Читатели', link: '/readers' },
    { icon: MeetingRoomIcon, title: 'Залы', link: '/halls' },
];

const Sidebar = () => { 
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };
    return (
        <div className="sidebar">
            <div className="logo-section">
                <img src={logoImage} alt="Logo" className="logo-image" />
                <div className="logo-text">
                    <span className="logo-title">LibraManager</span><br/>
                    <span className="library-label">БИБЛИОТЕКА</span>
                </div>
            </div>
            <ul className="menu-items">
                {menuItems.map(({ icon: Icon, title, link }, index) => (
                    <li key={index} className="menu-item">
                        <NavLink to={link} className="nav-link" activeclassname="active">
                            <Icon fontSize="medium" />
                            {title}
                        </NavLink>
                    </li>
                ))}
            </ul>
            <div className="logout-button">
                <button onClick={handleLogout}>
                    <LogoutIcon fontSize="medium" />
                    Выйти
                </button>
            </div>
        </div>
    );
};

export default Sidebar;