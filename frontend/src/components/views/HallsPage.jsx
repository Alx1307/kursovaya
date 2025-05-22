// HallsPage.js
import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import LocallibraryIcon from '@mui/icons-material/LocalLibrary';
import './Pages.css';

const HallsPage = () => {
  const [hallData, setHallData] = useState([]);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        const response = await fetch('http://localhost:8080/halls/all', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) throw new Error(`Ошибка загрузки залов.`);

        const data = await response.json();

        setHallData(data.map(item => ({
            ...item,
            id: item.hall_id,
        })));
      } catch (err) {
        console.error("Ошибка загрузки залов:", err);
      }
    };

    fetchHalls();
  }, []);

  const hallColumns = [
    { field: 'id', headerName: 'ID', flex: 0.05 },
    { field: 'number', headerName: 'Номер зала', flex: 0.15 },
    { field: 'specialization', headerName: 'Специализация', flex: 0.3 },
    { field: 'seats_quantity', headerName: 'Количество свободных мест', flex: 0.35 },
    {
      field: 'readers',
      headerName: 'Читатели',
      renderCell: () => (<LocallibraryIcon style={{ color: 'black' }} />),
      flex: 0.15,
    },
  ];

  return (
    <div>
      <Sidebar />
      <div className="content-container">
        <Header />
        <TableComponent columns={hallColumns} rows={hallData} />
      </div>
    </div>
  );
};

export default HallsPage;