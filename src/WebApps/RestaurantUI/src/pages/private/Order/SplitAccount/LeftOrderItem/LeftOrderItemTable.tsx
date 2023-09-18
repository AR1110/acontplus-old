
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
        editable: false,
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
    const { leftOrderItems, setCheckedOrderItem } = useSplitAccountContext();
    // const [promiseArguments, setPromiseArguments] = useState<any>(null);

    // const processRowUpdate = useCallback((newRow: GridRowModel, oldRow: GridRowModel) =>
    //     new Promise<GridRowModel>((resolve, reject) => {
    //         console.log(newRow, oldRow)
    //         const mutation = computeMutation(newRow, oldRow)

    //         if (mutation) {
    //             // Save the arguments to resolve or reject the promise later
    //             // setPromiseArguments({ resolve, reject, newRow, oldRow });
    //             Swal.fire({
    //                 title: '¿Estás seguro?',
    //                 text: `Al presionar 'Sí' cambiará ${mutation}.`,
    //                 icon: 'warning',
    //                 showCancelButton: true,
    //                 confirmButtonColor: '#3085d6',
    //                 cancelButtonColor: '#d33',
    //                 confirmButtonText: 'Sí!'
    //             }).then((result) => {
    //                 if (result.isConfirmed) {
    //                     Swal.fire(
    //                         'Deleted!',
    //                         'Your file has been deleted.',
    //                         'success'
    //                     )
    //                 }
    //             })
    //         } else {
    //             resolve(oldRow); // Nothing was changed
    //         }
    //     }),
    //     [],
    // );

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
                
                onRowSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRows = leftOrderItems.filter((row) => selectedIDs.has(row.id));
                    console.log(selectedRows)
                    setCheckedOrderItem(selectedRows)
                }}
            // isCellEditable={(params) => params.row.quantity > 1}
            //processRowUpdate={processRowUpdate}
            />
        </div>
    );
}

export default LeftOrderItemTable;