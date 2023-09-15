
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import CustomNoRowsOverlay from '@/core/components/CustomNoRowsOverlay/CustomNoRowsOverlay';
import { useSplitAccountContext } from '../../context';  

const columns: GridColDef[] = [
    { field: 'index', headerName: 'N°', width: 70 },
    { field: 'description', headerName: 'Descripción', width: 130 },
    {
        field: 'quantity',
        headerName: 'Cant.',
        type: 'number',
        width: 50, 
        editable: true,
    },
    {
        field: 'price',
        headerName: 'P. Venta',
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
 

const LeftOrderItemTable = () => { 
    const { leftOrderItems, setCheckedOrderItem} = useSplitAccountContext(); 
  
    const processRowUpdate = (newRow: GridRowModel) => {
        console.log(newRow)           
    }

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
                onRowSelectionModelChange ={(ids)=>{
                    const selectedIDs = new Set(ids); 
                    const selectedRows = leftOrderItems.filter((row) => selectedIDs.has(row.id));
                    setCheckedOrderItem(selectedRows)
                }} 
                 
            />
        </div>
    );
}

export default LeftOrderItemTable;