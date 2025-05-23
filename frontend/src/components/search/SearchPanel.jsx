import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';
import './SearchPanel.css';

const SearchPanel = ({ placeholder, pageType, buttonText }) => {
    const [decodedRole, setDecodedRole] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
          try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) return;
    
            const config = {
              headers: {
                'Authorization': `Bearer ${authToken}`
              }
            };
    
            const response = await axios.get('http://localhost:8080/librarian/data', config);
            const userData = response.data;
            setDecodedRole(userData.role);
          } catch (err) {
            console.error('Ошибка при получении роли:', err.message);
          }
        };
    
        fetchUserRole();
      }, []);

    const shouldShowButton = () => {
        switch(pageType) {
            case 'issue':
            case 'readers':
                return decodedRole === 'Библиотекарь';
            case 'employees':
                return decodedRole === 'Администратор';
            case 'books':
                return decodedRole === 'Библиограф';
            default:
                return false;
        }
    };

    return (
        <div className="search-panel">
        <input 
            type="text" 
            placeholder={placeholder} 
            className="search-input"
        />

        {shouldShowButton() && (
            <button className="add-button">
            <span className="add-icon"><AddCircleOutlineIcon /></span>
            {' '}{buttonText}
            </button>
        )}
        </div>
    );
};

export default SearchPanel;