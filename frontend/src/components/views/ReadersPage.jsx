import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchPanel from '../search/SearchPanel';
import axios from 'axios';
import './Pages.css';

const ReadersPage = () => {
  const [readerData, setReaderData] = useState([]);
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

    const fetchReaders = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        const response = await fetch('http://localhost:8080/readers/all', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) throw new Error(`Ошибка загрузки читателей.`);

        const data = await response.json();

        const transformedData = data.map((item) => ({
            ...item,
            id: item.reader_id,
        }));

        setReaderData(transformedData);
      } catch (err) {
        console.error("Ошибка загрузки читателей:", err);
      }
    };

    fetchReaders();
  }, []);

  const readerColumns = [
    { field: 'id', headerName: 'ID', flex: 0.1 },
    { field: 'name', headerName: 'ФИО', flex: 0.35 },
    { field: 'card_number', headerName: 'Номер читательского билета', flex: 0.3 },
    { field: 'phone', headerName: 'Телефон', flex: 0.2 },
    { field: 'hall_id', headerName: 'Зал', flex: 0.1 },
    {
        field: 'action',
        headerName: '',
        flex: 0.15,
        renderCell: (params) => (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
            height: '100%',
          }}>
            { decodedRole === 'Библиотекарь' ? (
              <>
                <EditIcon style={{ color: 'black', width: 25, height: 25 }} />
                <DeleteIcon style={{ color: 'black', width: 25, height: 25 }} />
                <ListAltIcon style={{ color: 'black', width: 25, height: 25 }} />
              </>
            ) : (
              <ListAltIcon style={{ color: 'black', width: 25, height: 25 }} />
            )}
          </div>
        ),
    },
  ];

  return (
    <div>
      <Sidebar />
      <div className="content-container">
        <Header />
        <SearchPanel placeholder="ФИО, номер телефона или № читательского билета" pageType="readers" buttonText="Добавить"/>
        <TableComponent columns={readerColumns} rows={readerData} />
      </div>
    </div>
  );
};

export default ReadersPage;