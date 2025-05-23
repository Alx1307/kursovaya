import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import LocallibraryIcon from '@mui/icons-material/LocalLibrary';
import HallReadersModal from '../modals/HallReadersModal';
import './Pages.css';

const HallsPage = () => {
  const [hallData, setHallData] = useState([]);
  const [selectedHallId, setSelectedHallId] = useState(null); // Текущий открытый зал
  const [modalOpen, setModalOpen] = useState(false); // Флаг открытого модала
  const [readersList, setReadersList] = useState([]); 

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

  const loadReadersForHall = async (hallId) => {
    try {
      const authToken = localStorage.getItem('authToken');

      const response = await fetch(`http://localhost:8080/halls/${hallId}/readers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error(`Ошибка загрузки читателей.`);

      const data = await response.json();
      setReadersList(data); // Устанавливаем список читателей
    } catch (err) {
      console.error("Ошибка загрузки читателей:", err);
    }
  };

  const handleOpenModal = (hallId) => {
    setSelectedHallId(hallId);
    loadReadersForHall(hallId); // Запрашиваем читателей перед открытием модала
    setModalOpen(true);
  };

  // Закрытие модального окна
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
  },
    {
      field: 'readers',
      headerName: 'Читатели',
      renderCell: (params) => (<LocallibraryIcon style={{ color: 'black' }} onClick={() => handleOpenModal(params.row.id)} />),
      flex: 0.15,
    },
  ];

  return (
    <div>
      <Sidebar />
      <div className="content-container">
        <Header />
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