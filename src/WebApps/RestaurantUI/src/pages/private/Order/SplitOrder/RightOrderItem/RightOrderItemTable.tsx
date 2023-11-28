
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomNoRowsOverlay from '@/core/components/CustomNoRowsOverlay/CustomNoRowsOverlay';
import { useSplitOrderContext } from '../../context'; 

const columns: GridColDef[] = [
    { field: 'index', headerName: 'N°', width: 70},
    { field: 'description', headerName: 'Descripción', width: 130 },
    {
        field: 'remainingQuantity',
        headerName: 'Cant.',
        type: 'number',
        width: 50, 
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
 

const RightOrderItemTable = () => {  
    const { rightOrderItems, setRightCheckedOrderItems, setLeftCheckedOrderItems} = useSplitOrderContext(); 

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={rightOrderItems}
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
                onRowSelectionModelChange ={(ids)=>{
                    const selectedIDs = new Set(ids); 
                    const selectedRows = rightOrderItems.filter((row) => selectedIDs.has(row.id));
                    setLeftCheckedOrderItems([])
                    setRightCheckedOrderItems(selectedRows)
                }}
                
                 
            />
        </div>
    );
}

export default RightOrderItemTable;