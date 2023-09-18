import React, { forwardRef, useCallback } from 'react'
import { Button, Dialog, DialogActions, DialogContent, Grid, Slide } from '@mui/material';
import { DataGrid, GridColDef, GridPreProcessEditCellProps, GridRowModel } from '@mui/x-data-grid';
import { TransitionProps } from '@mui/material/transitions';
import { useSplitAccountContext } from '../../context';
import Swal from 'sweetalert2';
import { SnackbarUtility } from '@/core/utilities';
const columns: GridColDef[] = [
    { field: 'index', headerName: 'N°', width: 70 },
    { field: 'description', headerName: 'Descripción', width: 200 },
    {
        field: 'quantityTemp',
        headerName: 'Cant.',
        type: 'number',
        width: 100,
        editable: false,
    },
    {
        field: 'quantity',
        headerName: 'Cant.',
        type: 'number',
        width: 100,
        editable: true,
        preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {

            let hasError = false;

            if (!params.props.value || params.props.value < 1) {
                hasError = true;
                SnackbarUtility.warning('Ingrese correctamente')
            }
            if (params.props.value > params.row.quantityTemp) {
                hasError = true;
                SnackbarUtility.warning('No puede ser mayor a la cantidad original')
            }
            return { ...params.props, error: hasError };
        },
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



const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type DialogChangeQtyProps = {
    open: boolean,
    setOpen(): void
}
const DialogChangeQty = ({ open, setOpen }: DialogChangeQtyProps) => {
    const { filteredItems, setFilteredItems } = useSplitAccountContext();

    const { intersection } = useSplitAccountContext();
    const { checkedOrderItems, setCheckedOrderItem } = useSplitAccountContext();
    const { leftOrderItems, setLeftOrderItem } = useSplitAccountContext();
    const { rightOrderItems, setRightOrderItem } = useSplitAccountContext();

    const leftChecked = intersection(checkedOrderItems, leftOrderItems);

    const processRowUpdate = (newRow: GridRowModel) => {
        const total = newRow["quantity"] * newRow["price"];
        newRow["total"] = total;
        const mergeFilteredItems = leftChecked.map((orderItem) =>
            orderItem.id === newRow["id"] ? newRow as any : orderItem
        );
        setFilteredItems(mergeFilteredItems);
        return newRow;
    }


    function mergeArraysByField<T extends { id: number; quantity: number; price: number, total: number }>(array1: T[], array2: T[], field: keyof T): T[] {
        // Realiza una copia superficial de array1 para evitar mutar el array original
        const mergedArray: T[] = [];

        for (const item1 of array1) {
            const dataOrderItem = array2.find((item) => item[field] === item1[field]);

            if (dataOrderItem) {
                // Si existe en array2, suma la cantidad y calcula el nuevo precio
                const qty = dataOrderItem["quantity"] + item1.quantity
                const total = qty + item1.price
                dataOrderItem.quantity = qty;
                dataOrderItem.total = total;
            } else {
                // Si no existe en array2, agrega el elemento de array1 en array2
                mergedArray.push(item1);
            }

        }

        for (const item2 of array2) {
            const existsInMergedArray = mergedArray.some((item) => item[field] === item2[field]);
            if (!existsInMergedArray) {
                mergedArray.push(item2);
            }
        }
        console.log(mergedArray)
        return mergedArray;
    }

    function mergeArraysByFieldLeft<T extends { id: number; quantity: number; price: number, total: number }>(
        array1: T[],
        array2: T[],
        field: keyof T
    ): T[] {
        const newArray2 = [...array2]; // Crear una copia de array2

        for (const item1 of array1) {
            const dataOrderItem = newArray2.find((item) => item[field] === item1[field]);

            if (dataOrderItem) {
                // Si la cantidad es diferente, resta la cantidad de array1 a newArray2
                if (item1.quantity !== dataOrderItem.quantity) {
                    dataOrderItem.quantity -= item1.quantity;
                } else {
                    // Si la cantidad es igual, elimina el elemento de newArray2
                    const item2Index = newArray2.findIndex((item) => item[field] === item1[field]);
                    if (item2Index !== -1) {
                        newArray2.splice(item2Index, 1);
                    }
                }
            }
        }

        return newArray2;
    }







    const close = () => {
        const mergeRightOrderItems = mergeArraysByField(filteredItems, rightOrderItems, 'id');
        const mergeLeftOrderItems = mergeArraysByFieldLeft(filteredItems, leftOrderItems, 'id');

        setRightOrderItem(mergeRightOrderItems);
        setLeftOrderItem(mergeLeftOrderItems);
        setCheckedOrderItem([]);
        setFilteredItems([])
        setOpen();
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth="md"
            TransitionComponent={Transition}
            keepMounted
            open={open}
        >
            <DialogContent dividers>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={filteredItems}
                        columns={columns}
                        // disableColumnSelector
                        // disableRowSelectionOnClick
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}

                        pageSizeOptions={[5, 10]}
                        isCellEditable={(params) => params.row.quantityTemp > 1}
                        processRowUpdate={processRowUpdate}

                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Button variant='contained' size='large' fullWidth onClick={setOpen}>
                            Continuar
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant='outlined' size='large' fullWidth onClick={() => close()}>
                            Cerrar
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}

export default DialogChangeQty