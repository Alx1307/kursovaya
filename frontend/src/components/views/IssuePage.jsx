import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import TableComponent from '../table/Table';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import EditIcon from '@mui/icons-material/Edit';
import SearchPanel from '../search/SearchPanel';
import ViewIssueModal from '../modals/ViewIssueModal';
import AddIssueModal from '../modals/AddIssueModal';
import EditIssueModal from '../modals/EditIssueModal';
import IconButton from '@mui/material/IconButton';
import ReturnIssueModal from '../modals/ReturnIssueModal';
import axios from 'axios';
import './Pages.css';
import api from '../../api/index';

const IssuePage = () => {
  const [issueData, setIssueData] = useState([]);
  const [decodedRole, setDecodedRole] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);

  const handleRowClick = (row) => {
    setSelectedIssue(row);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleEditOpen = (issueId) => {
    setSelectedIssue(issueId);
    setEditModalOpen(true);
  };

  const handleReturnOpen = (issueId) => {
    setSelectedIssue(issueId);
    setReturnModalOpen(true);
  };

  const fetchIssues = async () => {
    try {
      const authToken = localStorage.getItem('authToken');

      const response = await fetch('http://localhost:8080/issues/all', { 
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error('Ошибка загрузки выданных книг.');

      const data = await response.json();

      const transformedData = data.map(item => ({
        ...item,
        id: item.issue_id,
      }));

      setIssueData(transformedData);
    } catch (err) {
      console.error('Ошибка загрузки выданных книг:', err);
    }
  };

  const refreshIssues = () => {
    fetchIssues();
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

    fetchIssues();
  }, []); 

  const issueColumns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.05,
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
    { field: 'book_code', headerName: 'Шифр книги', flex: 0.1 },
    { field: 'reader_card_number', headerName: 'Номер читательского билета', flex: 0.2 },
    { field: 'issue_date', headerName: 'Дата выдачи', flex: 0.15 },
    {
        field: 'return_date',
        headerName: 'Дата возврата',
        flex: 0.15,
        renderCell: (params) => (
          <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5,
                height: '100%',
            }}>
            {params.value}
            { decodedRole === 'Библиотекарь' && (
              <IconButton className="IconButton" onClick={() => handleEditOpen(params.row)}>
                <EditIcon style={{ color: 'black', width: 25, height: 25 }} />
              </IconButton>
          )}
          </div>
        ),
    },
    {
      field: 'status',
      headerName: 'Статус',
      flex: 0.15,
      renderCell: (params) => {
        const isOverdue = params.row.status === 'Просрочена';
        const isReturned = params.row.status === 'Возвращена';
        let style = { fontWeight: 'normal', color: 'black' };
        if (isOverdue) {
          style = { fontWeight: 'bold', color: '#A44A3F', fontSize: '16px' };
        } else if (isReturned) {
          style = { fontWeight: 'bold', color: '#618d4a', fontSize: '16px' };
        }
        return (
          <span style={style}>
            {params.row.status}
          </span>
        );
      },
    },
  ];

  if (decodedRole === 'Библиотекарь') {
    issueColumns.push({
        field: 'return',
        headerName: 'Принять',
        renderCell: (params) => params.row.status !== 'Возвращена' ? (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5,
                height: '100%',
            }}>
                <IconButton className="IconButton" onClick={() => handleReturnOpen(params.row)}>
                    <ArrowCircleLeftIcon style={{ color: 'black', width: 25, height: 25 }} />
                </IconButton>
            </div>
        ) : null,
        flex: 0.1,
    });
  }

  return (
    <div>
      <Sidebar />
      <div className="content-container">
        <Header />
        {/*<SearchPanel placeholder="Шифр книги или № читательского билета" pageType="issue" buttonText="Выдать" onAddClick={handleAddClick} />*/}
        <TableComponent columns={issueColumns} rows={issueData} />
        <ViewIssueModal open={modalOpen} handleClose={() => setModalOpen(false)} issueData={selectedIssue} />
        <AddIssueModal open={showAddModal} handleClose={() => setShowAddModal(false)} onSuccess={refreshIssues} />
        <EditIssueModal open={editModalOpen} handleClose={() => setEditModalOpen(false)} issueData={selectedIssue} reloadIssueData={refreshIssues}/>
        <ReturnIssueModal open={returnModalOpen} handleClose={() => setReturnModalOpen(false)} issueData={selectedIssue} reloadIssueData={refreshIssues} />
      </div>
    </div>
  );
};

export default IssuePage;