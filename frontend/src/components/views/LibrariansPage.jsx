import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import SearchPanel from '../search/SearchPanel';
import IconButton from '@mui/material/IconButton';
import './Pages.css';

const LibrariansPage = () => {
  const [librarianData, setLibrarianData] = useState([]);
  const [selectedLibrarianId, setSelectedLibrarianId] = useState(null);

  useEffect(() => {
    const fetchLibrarians = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        const response = await fetch('http://localhost:8080/librarian/all', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) throw new Error(`Ошибка загрузки сотрудников.`);

        const data = await response.json();

        setLibrarianData(data.map(item => ({
          ...item,
          id: item.librarian_id,
        })));
      } catch (err) {
        console.error("Ошибка загрузки сотрудников:", err);
      }
    };

    fetchLibrarians();
  }, []);

  const librarianColumns = [
    {field: 'id', headerName: 'ID', flex: 0.1},
    {field: 'full_name', headerName: 'ФИО', flex: 0.3},
    {field: 'email', headerName: 'E-mail', flex: 0.3},
    {field: 'role', headerName: 'Роль', flex: 0.3}
  ];

  return (
    <div>
      <Sidebar />
      <div className="content-container">
        <Header />
        <SearchPanel placeholder="ФИО или e-mail" pageType="librarians" buttonText="Добавить"/>
        <TableComponent columns={librarianColumns} rows={librarianData}/>
      </div>
    </div>
  );
};

export default LibrariansPage;