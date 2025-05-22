import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const TableComponent = ({ columns, rows }) => {
  const updatedColumns = columns.map(column => ({
    ...column,
    headerAlign: 'center',
  }));

  return (
    <div style={{ height: 400, width: '100%', border: '2px solid #A44A3F', borderRadius: '4px' }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={updatedColumns}
        disablePagination
        hideFooterSelectedRowCount
        hideFooterRowCount
        hideFooter
        slotProps={{
          columnHeaders: {
            style: {
                color: '#A44A3F',
            },
          },
          cell: {
            style: {
              textAlign: 'center',
            },
          },
        }}
      />
    </div>
  );
};

export default TableComponent;