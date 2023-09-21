
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomNoRowsOverlay from '@/core/components/CustomNoRowsOverlay/CustomNoRowsOverlay';
import { useSplitOrderContext } from '../../context';
import { Alert, AlertTitle } from '@mui/material';

const columns: GridColDef[] = [
    { field: 'index', headerName: 'N°', width: 70 },
    { field: 'description', headerName: 'Descripción', width: 130 },
    {
        field: 'quantity',
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
        valueGetter: (params: GridValueGetterParams) => (params.row.quantity * params.row.priceWithVat).toFixed(2)
    },
];



const LeftOrderItemTable = () => {
    const {orderLoading, leftOrderItems, setLeftCheckedOrderItems, setRightCheckedOrderItems } = useSplitOrderContext();
     
    return (
        <div style={{ height: 400, width: '100%' }}> 
            <DataGrid
                rows={leftOrderItems}
                columns={columns}
                disableColumnSelector
                disableRowSelectionOnClick
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                rowSelection
                loading={orderLoading}
                onRowSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRows = leftOrderItems.filter((row) => selectedIDs.has(row.id));
                    console.log(selectedRows)
                    setRightCheckedOrderItems([])
                    setLeftCheckedOrderItems(selectedRows)
                }}

            // isCellEditable={(params) => params.row.quantity > 1}
            //processRowUpdate={processRowUpdate}
            />
        </div>
    );
}

export default LeftOrderItemTable;