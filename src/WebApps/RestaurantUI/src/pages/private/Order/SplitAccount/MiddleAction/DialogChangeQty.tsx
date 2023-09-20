import React, { forwardRef } from 'react'
import { Button, Dialog, DialogActions, DialogContent, Grid, Slide, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPreProcessEditCellProps, GridRowModel } from '@mui/x-data-grid';
import { TransitionProps } from '@mui/material/transitions';
import { useSplitAccountContext } from '../../context';
import { SnackbarUtility } from '@/core/utilities';
const columns: GridColDef[] = [
    { field: 'index', headerName: 'N°', width: 70 },
    { field: 'description', headerName: 'Descripción', width: 250 },
    {
        field: 'quantityTemp',
        headerName: 'Cant. Real',
        type: 'number',
        width: 130,
        editable: false,
    },
    {
        field: 'quantity',
        headerName: 'Cant.',
        type: 'number',
        width: 130,
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
    // {
    //     field: 'price',
    //     headerName: 'P. Venta',
    //     type: 'number',
    //     width: 110,
    // },
    {
        field: 'priceWithVat',
        headerName: 'P. IVA',
        type: 'number',
        width: 110,
    },
    {
        field: 'total',
        headerName: 'Total',
        type: 'number',
        width: 110,
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
    const { changeOrderItems, setChangeOrderItems, calculateOrderItemTotal } = useSplitAccountContext();

    const { intersection } = useSplitAccountContext();
    const { leftCheckedOrderItems, setLeftCheckedOrderItems } = useSplitAccountContext();
    const { leftOrderItems, setLeftOrderItem } = useSplitAccountContext();
    const { rightOrderItems, setRightOrderItem } = useSplitAccountContext();

    const leftChecked = intersection(leftCheckedOrderItems, leftOrderItems);
    const { mergeArraysByField, mergeArraysByFieldLeft } = useSplitAccountContext();

    //Totals order items changes QTY
    const objTempTotal = calculateOrderItemTotal(changeOrderItems)

    const processRowUpdate = (newRow: GridRowModel) => {
        const total = newRow["quantity"] * newRow["price"];
        newRow["total"] = total;
        const mergeFilteredItems = leftChecked.map((orderItem) => {
            return orderItem.id === newRow["id"] ? newRow as any : orderItem
        });

        //Actualizamos cantidades modificadas 
        setChangeOrderItems(mergeFilteredItems);
        return newRow;
    }


    const next = () => {
        const mergeRightOrderItems = mergeArraysByField(changeOrderItems, rightOrderItems, 'id');
        const mergeLeftOrderItems = mergeArraysByFieldLeft(changeOrderItems, leftOrderItems, 'id');

        setRightOrderItem(mergeRightOrderItems);
        setLeftOrderItem(mergeLeftOrderItems);
        setLeftCheckedOrderItems([]);
        setChangeOrderItems([])
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
                <Grid container alignItems="center">
                    <Grid item xs>
                    </Grid>
                    <Grid item xs>
                        <Stack direction="column"
                            justifyContent="center"
                            alignItems="flex-end">
                            <Typography variant="h6">
                                <b>Cant:</b> {objTempTotal.quantity}
                            </Typography>
                            <Typography variant="h6">
                                <b>Total:</b> {objTempTotal.total}
                            </Typography>
                        </Stack>

                    </Grid>
                </Grid>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={changeOrderItems}
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
                    <Grid item xs={6}>
                        <Button variant='contained' sx={{
                            height: 60
                        }} size='large' fullWidth onClick={next}>
                            Continuar
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant='outlined' sx={{
                            height: 60
                        }} size='large' fullWidth onClick={() => setOpen()}>
                            Cerrar
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}

export default DialogChangeQty