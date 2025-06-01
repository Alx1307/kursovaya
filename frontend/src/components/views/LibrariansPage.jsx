import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import SearchPanel from '../search/SearchPanel';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddUserModal from '../modals/AddUserModal';
import EditUserModal from '../modals/EditUserModal';
import ConfirmDeleteUserModal from '../modals/ConfirmDeleteUserModal';
import axios from 'axios';
import './Pages.css';

const LibrariansPage = () => {
  const [librarianData, setLibrarianData] = useState([]);
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleEditClick = (userId) => {
    setSelectedLibrarian(userId);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setDeleteModalOpen(true);
  };

  const deleteUser = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.delete(`http://localhost:8080/librarian/delete/${userToDelete}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.status === 200) {
        console.log('Сотрудник успешно удален');
        refreshUsers();
      }
    } catch (error) {
      console.error('Ошибка при удалении сотрудника:', error);
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
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
    {field: 'email', headerName: 'Email', flex: 0.25},
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
              <IconButton className="IconButton" onClick={() => handleEditClick(params.row)}>
                <EditIcon style={{ color: 'black', width: 25, height: 25 }} />
              </IconButton>
              <IconButton className="IconButton" onClick={() => handleDeleteClick(params.row.id)}>
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
        <SearchPanel placeholder="ФИО или email" pageType="librarians" buttonText="Добавить" onAddClick={handleAddClick}/>
        <TableComponent columns={librarianColumns} rows={librarianData}/>
        <AddUserModal open={showAddModal} handleClose={() => setShowAddModal(false)} onSuccess={refreshUsers} />
        <EditUserModal open={editModalOpen} handleClose={() => setEditModalOpen(false)} userData={selectedLibrarian} reloadUserData={refreshUsers}/>
        <ConfirmDeleteUserModal open={deleteModalOpen} handleClose={() => setDeleteModalOpen(false)} handleConfirm={deleteUser} />
      </div>
    </div>
  );
};

export default LibrariansPage;