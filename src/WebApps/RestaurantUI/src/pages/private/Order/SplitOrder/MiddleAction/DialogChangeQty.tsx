import React, { forwardRef, useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, Grid, Slide, Stack, Typography, styled } from '@mui/material';
import {
    DataGrid,
    GridCellModes,
    GridCellModesModel,
    GridCellParams,
    GridColDef,
    GridPreProcessEditCellProps,
    GridRowModel,
    GridValueGetterParams
} from '@mui/x-data-grid';
import { TransitionProps } from '@mui/material/transitions';
import { useSplitOrderContext } from '../../context';
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
        field: 'remainingQuantity',
        headerName: 'Cant.',
        type: 'number',
        width: 130,
        editable: true,
        preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
            let hasError = false;
            if (!params.props.value || params.props.value < 1) {
                hasError = true;
            }
            if (params.props.value > params.row.quantityTemp) {
                hasError = true;
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
        field: 'totalIVA',
        headerName: 'Total',
        type: 'number',
        width: 110,
        valueGetter: (params: GridValueGetterParams) => (params.row.remainingQuantity * params.row.priceWithVat).toFixed(2)
    },
];

const StyledBox = styled(Box)(({ theme }) => ({
    height: 300,
    width: '100%',
    '& .MuiDataGrid-cell--editing': {
        backgroundColor: 'rgb(255,215,115, 0.19)',
        color: '#1a3e72',
        '& .MuiInputBase-root': {
            height: '100%',
        },
    },
    '& .Mui-error': {
        backgroundColor: `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
        color: theme.palette.error.main,
    },
}));



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
    const {
        changeOrderItems,
        setChangeOrderItems,
        setLeftCheckedOrderItems,
        calculateOrderItemTotal
    } = useSplitOrderContext();

    const { leftOrderItems, setLeftOrderItem } = useSplitOrderContext();
    const { rightOrderItems, setRightOrderItem } = useSplitOrderContext();

    const { mergeArraysByField, mergeArraysByFieldLeft } = useSplitOrderContext();
    const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});


    //Totals order items changes QTY
    const objTempTotal = calculateOrderItemTotal(changeOrderItems)

    const processRowUpdate = (newRow: GridRowModel) => {
        // if(newRow["quantity"]===oldRow["quantity"]){
        //     return oldRow;
        // }
        const total = newRow["remainingQuantity"] * newRow["price"];
        newRow["total"] = total;
        const mergeFilteredItems = changeOrderItems.map((orderItem) => {
            return orderItem.id === newRow["id"] ? newRow as any : orderItem
        });

        //Actualizamos cantidades modificadas 
        setChangeOrderItems(mergeFilteredItems);
        return newRow;
    }

    const handleCellClick = React.useCallback(
        (params: GridCellParams, event: React.MouseEvent) => {
            if (!params.isEditable) {
                return;
            }

            // Ignore portal
            if (!event.currentTarget.contains(event.target as Element)) {
                return;
            }

            setCellModesModel((prevModel) => {
                return {
                    // Revert the mode of the other cells from other rows
                    ...Object.keys(prevModel).reduce(
                        (acc, id) => ({
                            ...acc,
                            [id]: Object.keys(prevModel[id] || {}).reduce(
                                (acc2, field) => ({
                                    ...acc2,
                                    [field]: { mode: GridCellModes.View },
                                }),
                                {},
                            ),
                        }),
                        {},
                    ),
                    [params.id]: {
                        // Revert the mode of other cells in the same row
                        ...Object.keys(prevModel[params.id] || {}).reduce(
                            (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
                            {},
                        ),
                        [params.field]: { mode: GridCellModes.Edit },
                    },
                };
            });
        },
        [],
    );


    const handleCellModesModelChange = React.useCallback(
        (newModel: GridCellModesModel) => {
            setCellModesModel(newModel);
        },
        [],
    );

    //Agrega en la tabla cuenta dividual
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
                                <b>Cant:</b> {objTempTotal.remainingQuantity}
                            </Typography>
                            <Typography variant="h6">
                                <b>Total:</b> {objTempTotal.total}
                            </Typography>
                        </Stack>

                    </Grid>
                </Grid>
                <StyledBox>
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
                        cellModesModel={cellModesModel}
                        onCellModesModelChange={handleCellModesModelChange}
                        onCellClick={handleCellClick}

                        pageSizeOptions={[5, 10]}
                        isCellEditable={(params) => params.row.quantityTemp > 1}
                        processRowUpdate={processRowUpdate}

                    />
                </StyledBox>
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