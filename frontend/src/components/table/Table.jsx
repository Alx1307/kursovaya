import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const TableComponent = ({ columns, rows, height = '75vh', width = '100%' }) => {
  const updatedColumns = columns.map(column => ({
    ...column,
    headerAlign: 'center',
  }));

  return (
    <div style={{ height: '100vh', overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '10px' }}>
      <div style={{ height: height, width: width, overflow: 'auto', border: '2px solid #A44A3F', borderRadius: '1px', margin: '0'}}>
        <DataGrid
          rows={rows}
          columns={updatedColumns}
          disableSelectionClick
          disableDensitySelector
          hideFooterSelectedRowCount
          hideFooterRowCount
          hideFooter
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#fff',
              color: '#A44A3F',
            },
            '& .MuiDataGrid-cell': {
              textAlign: 'center',
            },
            '& .MuiDataGrid-root': {
              overflow: 'auto'
            },
          }}
        />
      </div>
    </div>
  );
};
export default TableComponent;