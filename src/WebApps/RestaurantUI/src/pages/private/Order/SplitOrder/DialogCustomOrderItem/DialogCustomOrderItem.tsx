import React, { forwardRef, useState } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Slide,
    TextField,
    Typography,
    styled
} from '@mui/material';
import {
    DataGrid,
    GridCellModes,
    GridCellModesModel,
    GridCellParams,
    GridColDef,
    GridRowModel,
    GridValueGetterParams
} from '@mui/x-data-grid';
import { TransitionProps } from '@mui/material/transitions';
import { useSplitOrderContext } from '../../context';
import { SaveIcon } from '@/core/components/IconsMaterial';
import CustomerSearch from '@/core/components/Customer/CustomerSearch';
import ProductSearch from '@/core/components/Product/ProductSearch';
import { v4 as uuidv4 } from 'uuid';
import { ITEM_TYPE_CODE } from '@/core/constants';
import { productService } from '@/core/services';
import { Measure, ProductPVPReadDto } from '@/core/models';
import { SnackbarUtility } from '@/core/utilities';
import Swal from 'sweetalert2';

const columns: GridColDef[] = [
    { field: 'index', headerName: 'N°', width: 70 },
    { field: 'code', headerName: 'Código', width: 120 },
    {
        field: 'description',
        headerName: 'Descripción',
        width: 290,
        editable: true
    },
    {
        field: 'quantity',
        headerName: 'Cant.',
        type: 'number',
        width: 100,
    },
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
        valueGetter: (params: GridValueGetterParams) => (params.row.quantity * params.row.priceWithVat).toFixed(2)
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
    return <Slide direction="down" ref={ref} {...props} />;
});


type DialogCustomOrderItemProps = {
    open: boolean,
    setOpen(): void
}


const DialogCustomOrderItem = ({ open, setOpen }: DialogCustomOrderItemProps) => {
    const {
        dataForm,
        leftOrder,
        leftCheckedOrderItems,
        changeOrderItems,
        setChangeOrderItems,
        calculateOrderItemTotal,
        setRightOrderData,
        rightOrder
    } = useSplitOrderContext();
    const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});


    //Totals order items changes QTY
    const objTempTotal = calculateOrderItemTotal(changeOrderItems)



    const joinOrderItemTotal = () => {
        return leftCheckedOrderItems.reduce((total, orderItem) => {
            total.taxValue += orderItem.taxValue
            total.quantity += orderItem.quantity;
            total.price += orderItem.price;
            total.priceWithVat += orderItem.priceWithVat;
            total.discount = orderItem.discount
            total.total = orderItem.total;
            total.bodegaId = orderItem.bodegaId;
            return total;
        }, {
            taxValue: 0,
            quantity: 0,
            price: 0,
            priceWithVat: 0,
            discount: 0,
            total: 0,
            bodegaId: 0,
        })
    }

    const onChangeProductSearch = (productId: number) => {
        productService.findForSale(productId).then(response => {
            const { product, measures } = response;
            const measureData = measures.find(measure => measure.measureId === product.measureId) as Measure;  //Medida         
            const taxRateData = dataForm.taxRates.find(item => item.taxRateCode === product.taxRateCode); // Tarifa Impuesto 
            const taxData = dataForm.taxes.find(tax => tax.code === taxRateData?.taxCode); // Impuesto IVA-ICE 
            const taxId = taxData?.taxId ?? 0 //id Impuesto 

            const taxPercentId = taxRateData?.taxRateId ?? 0; //Id TipoIva

            const { taxValue, price, discount, total, bodegaId, priceWithVat } = joinOrderItemTotal();
            const { feeId } = measureData.pvps[0] as ProductPVPReadDto

            const obj = {
                index: 0,
                productId,
                id: 0,
                uuid: uuidv4(),
                orderId: leftOrder.orderId,
                itemId: 0,
                taxId,
                taxPercentId,
                taxValue,
                quantity: 1,
                cost: product.costPrice, //Precio Costo
                price,
                discount,
                total,
                obs: "",
                feeId,
                bodegaId,
                description: product.description,
                code: product.productCode,
                s3ObjectUrl: "",
                carryInventory: false,
                priceWithVat,
                discountTotal: 0,
                taxes: [{
                    uuid: uuidv4(),
                    taxId: taxId,
                    taxPercentId: taxPercentId,
                    taxBase: price,
                    taxValue: taxValue,
                }],
                pvps: [],
                itemTypeCode: ITEM_TYPE_CODE.ITEM,
                envioSri: true
            }
            setChangeOrderItems([obj]);
        })

    }

    const handleCellClick = (params: GridCellParams, event: React.MouseEvent) => {

        if (!params.isEditable) {
            return;
        }

        // Ignore portal
        if (!event.currentTarget.contains(event.target as Element)) {
            return;
        }

        if (params.field === "description") {

            setCellModesModel((prevModel) => {
                return {
                    // Revert the mode of the other cells from other rows
                    ...Object.keys(prevModel).reduce((acc, id) => ({
                        ...acc,
                        [id]: Object.keys(prevModel[params.id] || {}).reduce((acc2, field) => ({
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
        }
    }

    const handleCellModesModelChange = (newModel: GridCellModesModel) => {
        setCellModesModel(newModel);
    }

    const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
        if (newRow["description"] === oldRow["description"]) {
            return oldRow;
        }
        newRow["description"] = newRow["description"].toUpperCase()
        const mergeFilteredItems = changeOrderItems.map((orderItem) => {
            console.log(orderItem.id, newRow["id"])
            return orderItem.id === newRow["id"] ? newRow as any : orderItem
        });
        //Actualizamos cantidades modificadas 
        setChangeOrderItems(mergeFilteredItems);

        return newRow;
    }


    const saveAsInvoice = async () => {
        try {
            if (!(rightOrder.customerCompanyId > 0)) {
                SnackbarUtility.warning('Seleccione el cliente');
                return
            }

            if (changeOrderItems.length === 0) {
                SnackbarUtility.warning('El detalle no puede ser vacio');
                return
            }
            if(changeOrderItems.some(or=>!(or.envioSri))){
                SnackbarUtility.warning('No has ingresado detalle personalizado');
                return
            }

            const { isConfirmed } = await Swal.fire({
                title: `Guardar`,
                html: `Esta seguro de guardar como Factura? </br>
                <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Guardar',
                cancelButtonText: 'No, cancelar!'
            })

            if (!isConfirmed) return
            console.log('invoice')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth="md"
            TransitionComponent={Transition}
            keepMounted
            open={open}
        >
            <DialogTitle>
                {"Detalle Personalizado"}
            </DialogTitle>
            <Typography variant="h6" sx={{
                position: 'absolute',
                right: 8,
                top: 15,
                mr: 3
            }}>
                <b>Total:</b> {objTempTotal.total}
            </Typography>
            <DialogContent dividers>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <CustomerSearch customerCompanyId={rightOrder.customerCompanyId} customerName='' onChangeCustomer={(data) => {
                            if (data) {
                                setRightOrderData({
                                    ...rightOrder,
                                    customerCompanyId: data.customerCompanyId,
                                    customerName: data.customerName
                                })
                            }
                        }} />
                    </Grid>
                    <Grid item xs={12} marginBottom={1}>
                        <ProductSearch onChangeProductSearch={onChangeProductSearch} />
                    </Grid>
                </Grid>
                <StyledBox>
                    <DataGrid
                        rows={changeOrderItems}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}

                        isCellEditable={(params) => (params.row.envioSri)}
                        cellModesModel={cellModesModel}
                        onCellModesModelChange={handleCellModesModelChange}
                        onCellClick={handleCellClick}
                        processRowUpdate={processRowUpdate}

                        pageSizeOptions={[5, 10]}
                    />
                </StyledBox>
                <Box marginBottom={1} marginTop={1}>
                    <TextField
                        id="obs"
                        label="Observación"
                        name='obs'
                        onChange={(e) => {
                            setRightOrderData({
                                ...rightOrder,
                                obs: e.target.value
                            })
                        }}
                        fullWidth
                        multiline
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Button color='success' variant='contained' sx={{
                            height: 60
                        }} size='large' fullWidth onClick={saveAsInvoice} >
                            <SaveIcon />
                            Factura
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button color='inherit' variant='outlined' sx={{
                            height: 60
                        }} size='large' fullWidth onClick={() => {
                            setRightOrderData({
                                ...rightOrder,
                                customerCompanyId: 0,
                                customerName: "",
                                obs: ""
                            })
                            setOpen()
                        }}>
                            Cerrar
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}

export default DialogCustomOrderItem
