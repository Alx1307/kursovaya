import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchPanel from '../search/SearchPanel';
import IconButton from '@mui/material/IconButton';
import ViewReaderModal from '../modals/ViewReaderModal';
import AddReaderModal from '../modals/AddReaderModal';
import ConfirmDeleteReaderModal from '../modals/ConfirmDeleteReaderModal';
import ReaderIssuesModal from '../modals/ReaderIssuesModal';
import EditReaderModal from '../modals/EditReaderModal';
import axios from 'axios';
import './Pages.css';
import { toast } from 'react-toastify';
import api from '../../api/index';

const ReadersPage = () => {
  const [readerData, setReaderData] = useState([]);
  const [decodedRole, setDecodedRole] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [readerToDelete, setReaderToDelete] = useState(null);
  const [issuesModalOpen, setIssuesModalOpen] = useState(false);
  const [issuesList, setIssuesList] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleRowClick = (row) => {
    setSelectedUser(row);
    setModalOpen(true);
  };

  const handleAddClick = () => {
     setShowAddModal(true);
  };

  const handleDeleteClick = (readerId) => {
    setReaderToDelete(readerId);
    setDeleteModalOpen(true);
  };

  const handleOpenIssuesModal = (readerId) => {
    setSelectedUser(readerId),
    loadIssuesForReader(readerId),
    setIssuesModalOpen(true);
  };

  const handleCloseIssuesModal = () => {
    setIssuesModalOpen(false);
    setSelectedUser(null);
    setIssuesList([]);
  };

  const handleEditClick = (readerId) => {
    setSelectedUser(readerId);
    setEditModalOpen(true);
  };

  const deleteReader = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.delete(`http://localhost:8080/readers/delete/${readerToDelete}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.status === 200) {
        toast.success('Читатель успешно удален');
        refreshReaders();
      }
    } catch (error) {
      toast.error('Ошибка при удалении читателя.');
      console.error('Ошибка при удалении читателя:', error);
    } finally {
      setDeleteModalOpen(false);
      setReaderToDelete(null);
    }
  };

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

  const loadIssuesForReader = async (readerId) => {
    try {
      const authToken = localStorage.getItem('authToken');

      const response = await fetch(`http://localhost:8080/readers/${readerId}/issues`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      setIssuesList(data);
    } catch (err) {
      console.error("Ошибка загрузки выдач:", err);
    }
  };

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

        const response = await api.get('http://localhost:8080/librarian/data', config);
        const userData = response.data;
        setDecodedRole(userData.role);
      } catch (err) {
        console.error('Ошибка при получении роли:', err.message);
      }
    };

    fetchUserRole();

    fetchReaders();
  }, []);

  const refreshReaders = () => {
    fetchReaders();
  };

  const readerColumns = [
    { field: 'id', headerName: 'ID', flex: 0.1 },
    {
      field: 'name',
      headerName: 'ФИО',
      flex: 0.35,
      renderCell: (params) => (
        <div
          style={{
            display: 'inline-block',
            cursor: 'pointer'
          }}
          onClick={() => handleRowClick(params.row)}
        >
          {params.value}
        </div>
      )
    },
    { field: 'card_number', headerName: 'Номер читательского билета', flex: 0.25 },
    { field: 'phone', headerName: 'Телефон', flex: 0.2 },
    { field: 'hall_id', headerName: 'Зал', flex: 0.1 },
    {
        field: 'action',
        headerName: '',
        flex: 0.2,
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
            { decodedRole === 'Библиотекарь' ? (
              <>
                <IconButton className="IconButton" onClick={() => handleEditClick(params.row)}>
                  <EditIcon style={{ color: 'black', width: 25, height: 25 }} />
                </IconButton>
                <IconButton className="IconButton" onClick={() => handleDeleteClick(params.row.id)}>
                  <DeleteIcon style={{ color: 'black', width: 25, height: 25 }} />
                </IconButton>
                <IconButton className="IconButton" onClick={() => handleOpenIssuesModal(params.row.id)}>
                  <ListAltIcon style={{ color: 'black', width: 25, height: 25 }} />
                </IconButton>
              </>
            ) : (
              <IconButton className="IconButton" onClick={() => handleOpenIssuesModal(params.row.id)}>
                  <ListAltIcon style={{ color: 'black', width: 25, height: 25 }} />
              </IconButton>
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
        <SearchPanel placeholder="Номер телефона или № читательского билета" pageType="readers" buttonText="Добавить" onAddClick={handleAddClick}/>
        <TableComponent columns={readerColumns} rows={readerData} />
        <ViewReaderModal open={modalOpen} handleClose={() => setModalOpen(false)} readerData={selectedUser} />
        <AddReaderModal open={showAddModal} handleClose={() => setShowAddModal(false)} onSuccess={refreshReaders} />
        <ConfirmDeleteReaderModal open={deleteModalOpen} handleClose={() => setDeleteModalOpen(false)} handleConfirm={deleteReader} />
        <ReaderIssuesModal issuesList={issuesList} open={issuesModalOpen} handleClose={handleCloseIssuesModal}/>
        <EditReaderModal open={editModalOpen} handleClose={() => setEditModalOpen(false)} readerData={selectedUser} reloadReaderData={refreshReaders}/>
      </div>
    </div>
  );
};

export default ReadersPage;