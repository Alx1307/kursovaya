import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import LocallibraryIcon from '@mui/icons-material/LocalLibrary';
import HallReadersModal from '../modals/HallReadersModal';
import SearchPanel from '../search/SearchPanel';
import IconButton from '@mui/material/IconButton';
import './Pages.css';
import api from '../../api/index';

const HallsPage = () => {
  const [hallData, setHallData] = useState([]);
  const [selectedHallId, setSelectedHallId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [readersList, setReadersList] = useState([]); 

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await api.get('http://localhost:8080/halls/all', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        setHallData(response.data.map(item => ({
          ...item,
          id: item.hall_id,
        })));
      } catch (err) {
        console.error("Ошибка загрузки залов:", err);
      }
    };

    fetchHalls();
  }, []);

  const loadReadersForHall = async (hallId) => {
    try {
      const authToken = localStorage.getItem('authToken');

      const response = await fetch(`http://localhost:8080/halls/${hallId}/readers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      
      setReadersList(data);
    } catch (err) {
      console.error("Ошибка загрузки читателей:", err);
    }
  };

  const handleOpenModal = (hallId) => {
    setSelectedHallId(hallId);
    loadReadersForHall(hallId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedHallId(null);
    setReadersList([]);
  };

  const hallColumns = [
    { field: 'id', headerName: 'ID', flex: 0.05 },
    { field: 'number', headerName: 'Номер зала', flex: 0.15 },
    { field: 'specialization', headerName: 'Специализация', flex: 0.3 },
    {
      field: 'seatsString',
      headerName: 'Количество свободных мест',
      flex: 0.35,
      renderCell: (params) => {
        const isFull = parseInt(params.row.freeSeats) < 10;
        return (
          <span style={{ fontWeight: isFull ? 'bold' : 'normal', color: isFull ? '#A44A3F' : 'black', fontSize: isFull ? '18px' : '' }}>
            {params.row.freeSeats}/{params.row.seatsQuantity}
          </span>
        );
      },
  },
    {
      field: 'readers',
      headerName: 'Читатели',
      renderCell: (params) => (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 5,
          height: '100%',
        }}>
          <IconButton className="IconButton" onClick={() => handleOpenModal(params.row.id)}>
            <LocallibraryIcon style={{ color: 'black' }} />
          </IconButton>

        </div>
      ),
      flex: 0.15,
    },
  ];

  return (
    <div>
      <Sidebar />
      <div className="content-container">
        <Header />
        <SearchPanel placeholder="ФИО, номер телефона или № читательского билета" pageType="halls" buttonText="Добавить"/>
        <TableComponent columns={hallColumns} rows={hallData} />
        <HallReadersModal 
          readersList={readersList} 
          open={modalOpen} 
          handleClose={handleCloseModal} 
        />
      </div>
    </div>
  );
};

export default HallsPage;