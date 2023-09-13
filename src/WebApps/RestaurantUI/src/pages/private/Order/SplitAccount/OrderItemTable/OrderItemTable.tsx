import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomNoRowsOverlay from '@/core/components/CustomNoRowsOverlay/CustomNoRowsOverlay';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'N°', width: 70 },
  { field: 'descripcion', headerName: 'Descripción', width: 130 }, 
  {
    field: 'precioVenta',
    headerName: 'Precio Venta',
    type: 'number',
    width: 100,
  },
  {
    field: 'total',
    headerName: 'Total',
    type: 'number',
    width: 100,
  }, 
];

const rows = [
  { id: 1, descripcion: 'Snow',   precioVenta: 35, total: 0 },
  { id: 2, descripcion: 'Lannister',  precioVenta: 42, total: 0 },
  { id: 3, descripcion: 'Lannister',   precioVenta: 45, total: 0 },
  { id: 4, descripcion: 'Stark',   precioVenta: 16, total: 0 },
  { id: 5, descripcion: 'Targaryen',   precioVenta: 0, total: 0 },
  { id: 6, descripcion: 'Melisandre',  precioVenta: 150, total: 0 },
  { id: 7, descripcion: 'Clifford',   precioVenta: 44, total: 0 },
  { id: 8, descripcion: 'Frances',   precioVenta: 36, total: 0 },
  { id: 9, descripcion: 'Roxie',   precioVenta: 65, total: 0 },
];

const OrderItemTable =()=> {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={[]}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}

export default OrderItemTable;