
import { DataGrid, GridColDef } from '@mui/x-data-grid';
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
    const { leftOrderItems } = useSplitAccountContext();
    console.log(leftOrderItems)
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={leftOrderItems}
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

export default LeftOrderItemTable;