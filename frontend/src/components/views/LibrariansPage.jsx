import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import SearchPanel from '../search/SearchPanel';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddUserModal from '../modals/AddUserModal';
import './Pages.css';

const LibrariansPage = () => {
  const [librarianData, setLibrarianData] = useState([]);
  const [selectedLibrarianId, setSelectedLibrarianId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddClick = () => {
    setShowAddModal(true);
  };

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

  const refreshUsers = () => {
    fetchLibrarians();
  };

  const librarianColumns = [
    {field: 'id', headerName: 'ID', flex: 0.1},
    {field: 'full_name', headerName: 'ФИО', flex: 0.3},
    {field: 'email', headerName: 'E-mail', flex: 0.25},
    {field: 'role', headerName: 'Роль', flex: 0.25},
    {
      field: 'action',
      headerName: '',
      flex: 0.1,
      renderCell: (params) => (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 5,
          height: '100%',
          cursor: 'pointer',
        }}
        >
            <>
              <IconButton className="IconButton">
                <EditIcon style={{ color: 'black', width: 25, height: 25 }} />
              </IconButton>
              <IconButton className="IconButton" >
                <DeleteIcon style={{ color: 'black', width: 25, height: 25 }} />
              </IconButton>
            </>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Sidebar />
      <div className="content-container">
        <Header />
        <SearchPanel placeholder="ФИО или e-mail" pageType="librarians" buttonText="Добавить" onAddClick={handleAddClick}/>
        <TableComponent columns={librarianColumns} rows={librarianData}/>
        <AddUserModal open={showAddModal} handleClose={() => setShowAddModal(false)} onSuccess={refreshUsers} />
      </div>
    </div>
  );
};

export default LibrariansPage;