import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';
import './SearchPanel.css';

const SearchPanel = ({ placeholder, pageType, buttonText, onAddClick }) => {
    const [decodedRole, setDecodedRole] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            case 'librarians':
                return decodedRole === 'Администратор';
            case 'books':
                return decodedRole === 'Библиограф';
            default:
                return false;
        }
    };

    const apiConfig = {
      books: { url: '/search/books/search', paramKey: 'query' },
      readers: { url: '/search/readers/search', paramKey: 'query' },
      librarians: { url: '/search/librarians/search', paramKey: 'query' },
      issue: { url: '/search/issues/search', paramKey: 'query' }
    };

    const handleSearch = async () => {
      setError('');
      setLoading(true);
      setResults([]);

      if (!searchQuery.trim()) {
        setError('Введите запрос для поиска');
        setLoading(false);
        return;
      }

      const config = apiConfig[pageType];

      if (!config) {
        setError('Неизвестный тип поиска');
        setLoading(false);
        return;
      }

      try {
        const authToken = localStorage.getItem('authToken');

        const response = await axios.get(
          `http://localhost:8080${config.url}`,
          {
            params: { [config.paramKey]: searchQuery.trim() },
            headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
          }
        );
        setResults(response.data);
      } catch (err) {
        console.error('Ошибка при поиске:', err);
        setError('Ошибка при выполнении поиска. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    return (
        <div className="search-panel">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flexGrow: 1,
            padding: '10px 12px 10px 40px',
            fontSize: 16,
            borderRadius: 8,
            border: '1px solid #d1d5db',
            outline: 'none',
            color: '#374151',
            transition: 'border-color 0.2s ease-in-out'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          aria-label="Поиск"
          autoComplete="off"
        />
          <SearchIcon style={{
            position: 'absolute',
            left: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#aaa',
            pointerEvents: 'none',
            fontSize: '20px',
          }} />
          <button 
            className='search-button'
            variant="contained" 
            style={{ marginLeft: '10px', height: '40px' }} 
            onClick={handleSearch}
          >
            Найти
          </button>
        </div>

        {shouldShowButton() && (
            <button className="add-button" onClick={onAddClick}>
            <span className="add-icon"><AddCircleOutlineIcon /></span>
            {' '}{buttonText}
            </button>
        )}

        {loading && (
          <p style={{ marginTop: 16, color: '#6b7280', fontStyle: 'italic' }}>Загрузка...</p>
        )}
        {error && (
          <p style={{ marginTop: 16, color: '#dc2626', fontWeight: '600' }}>{error}</p>
        )}

        {!loading && results.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#111827' }}>Результаты поиска</h3>
            <ul style={{ listStyle: 'none', padding: 0, color: '#374151' }}>
              {results.map((item, index) => {
                let label = '';
                switch (pageType) {
                  case 'books':
                    label = `${item.title} ${item.code ? `(${item.code})` : ''}`;
                    break;
                  case 'readers':
                    label = `${item.name} - ${item.card_number}`;
                    break;
                  case 'librarians':
                    label = `${item.full_name || ''} - ${item.email}`;
                    break;
                  case 'issue':
                    label = `ID выдачи: ${item.issue_id}, Книга: ${item.Book?.title || 'Неизвестно'}, Читатель: ${item.Reader?.name || 'Неизвестно'}`;
                    break;
                  default:
                    label = JSON.stringify(item);
                }
                return (
                  <li key={item.id || item.issue_id || index} style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                    {label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {!loading && results.length === 0 && searchQuery && !error && (
          <p style={{ marginTop: 16, color: '#6b7280' }}>Ничего не найдено по запросу.</p>
        )}
        </div>
    );
};

export default SearchPanel;