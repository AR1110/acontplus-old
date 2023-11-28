
import { DataGrid, GridColDef, GridRowParams, GridValueGetterParams } from '@mui/x-data-grid';
import CustomNoRowsOverlay from '@/core/components/CustomNoRowsOverlay/CustomNoRowsOverlay';
import { useSplitOrderContext } from '../../context'; 
import React from 'react';

const columns: GridColDef[] = [
    { field: 'index', headerName: 'N°', width: 70 },
    { field: 'description', headerName: 'Descripción', width: 130 },
    {
        field: 'remainingQuantity',
        headerName: 'Cant.',
        type: 'number',
        width: 50,
        editable: false,
    },
    // {
    //     field: 'price',
    //     headerName: 'P. Venta',
    //     type: 'number',
    //     width: 100,
    // },
    {
        field: 'priceWithVat',
        headerName: 'P. IVA',
        type: 'number',
        width: 100,
        valueGetter: (params: GridValueGetterParams) => (params.row.priceWithVat).toFixed(2)
    },
    {
        field: 'totalIVA',
        headerName: 'Total',
        type: 'number',
        width: 100,
        valueGetter: (params: GridValueGetterParams) => (params.row.remainingQuantity * params.row.priceWithVat).toFixed(2)
    },
];



const LeftOrderItemTable = () => {
    const {orderLoading, leftOrderItems, setLeftCheckedOrderItems, setRightCheckedOrderItems } = useSplitOrderContext();
     
    return (
        <div style={{ height: 600, width: '100%' }}> 
            <DataGrid
                rows={leftOrderItems}
                columns={columns}
                disableColumnSelector
                disableRowSelectionOnClick
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 25 },
                    },
                }}
                slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                pageSizeOptions={[25, 50]}
                checkboxSelection
                rowSelection
                loading={orderLoading}                 
                onRowSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRows = leftOrderItems.filter((row) => selectedIDs.has(row.id));            
                    setRightCheckedOrderItems([])
                    setLeftCheckedOrderItems(selectedRows)
                }}
                isRowSelectable={(params: GridRowParams) => !(params.row.remainingQuantity === 0 && params.row.paid)}
            />
        </div>
    );
}

export default LeftOrderItemTable;