import React, { forwardRef, useState, useEffect } from 'react'
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
    GridColumnVisibilityModel,
    GridRowModel,
    GridValueGetterParams
} from '@mui/x-data-grid';
import { TransitionProps } from '@mui/material/transitions';
import { useSplitOrderContext } from '../../context';
import { SaveIcon } from '@/core/components/IconsMaterial';
import CustomerSearch from '@/core/components/Customer/CustomerSearch';
import ProductSearch from '@/core/components/Product/ProductSearch';
import { v4 as uuidv4 } from 'uuid';
import { DOC_TYPE, ITEM_TYPE_CODE } from '@/core/constants';
import { orderService, productService } from '@/core/services';
import { Measure, ProductPVPReadDto } from '@/core/models';
import { PricingCalculateUtility, SnackbarUtility } from '@/core/utilities';
import Swal from 'sweetalert2';
import { itemToApi, summaryToApi } from '@/core/adapters';
import { showLoader, hideLoader } from '@/spinner'
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
        field: 'tarifaImpuesto',
        headerName: 'IVA',
        width: 80,
    },
    {
        field: 'remainingQuantity',
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
    // {
    //     field: 'taxValue',
    //     headerName: 'Valor IVA',
    //     type: 'number',
    //     width: 110,
    // },
    // {
    //     field: 'price',
    //     headerName: 'P. Unitario',
    //     type: 'number',
    //     width: 110,
    // },
    // {
    //     field: 'total',
    //     headerName: 'Total Venta',
    //     type: 'number',
    //     width: 110,
    // },
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
    return <Slide direction="down" ref={ref} {...props} />;
});


type DialogCustomOrderItemProps = {
    open: boolean,
    setOpen(): void
}


const DialogCustomOrderItem = ({ open, setOpen }: DialogCustomOrderItemProps) => {
    const {
        setActionType,
        dataForm,
        leftOrder,
        changeOrderItems,
        setChangeOrderItems,
        calculateOrderItemTotal,
        setRightOrderData,
        rightOrder,
        setPaymentData,
        resetData,
    } = useSplitOrderContext();
    const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
        tarifaImpuesto: false,
        index: true,
    });
    //Totals order items changes QTY
    const objTempTotal = calculateOrderItemTotal(changeOrderItems);
    const [loader, setLoader] = useState(false);

    const onChangeProductSearch = (productId: number) => {
        productService.findForSale(productId).then(response => {
            const { product, measures } = response;
            const measureData = measures.find(measure => measure.measureId === product.measureId) as Measure;  //Medida         
            const taxRateData = dataForm.taxRates.find(item => item.taxRateCode === product.taxRateCode); // Tarifa Impuesto 
            const taxData = dataForm.taxes.find(tax => tax.code === taxRateData?.taxCode); // Impuesto IVA-ICE 
            const taxId = taxData?.taxId ?? 0 //id Impuesto 

            const taxPercentId = taxRateData?.taxRateId ?? 0; //Id TipoIva

            if (product.carryInventory) {
                Swal.fire({
                    icon: 'warning',
                    title: '',
                    html: 'Seleccione un articulo de tipo servicio, por favor'
                })
                return
            }
            // const { taxValue, price, discount, total, bodegaId, priceWithVat } = joinOrderItemTotal();
            const { feeId } = measureData.pvps.find(pvp=>(pvp.default)) as ProductPVPReadDto;

            const priceWithVat = objTempTotal.total;
            const price = PricingCalculateUtility.calculatePriceSale(priceWithVat, taxRateData?.percentage ?? 0);
            const taxValue = priceWithVat - price;
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
                remainingQuantity: 1,
                cost: product.costPrice, //Precio Costo
                price,
                discount: 0,
                total: price,
                obs: "",
                feeId,
                bodegaId: changeOrderItems[0]?.bodegaId ?? 0,
                description: product.description, 
                measureId: measureData ? measureData.measureId : 0,
                measures: [],
                summary: "",
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
                envioSri: true,
                tarifaImpuesto: product.tarifaImpuesto,
                paid: false,
            }
            setChangeOrderItems([obj]);
            setColumnVisibilityModel({ tarifaImpuesto: true, index: false })
        })

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


    const handleCellModesModelChange = React.useCallback((newModel: GridCellModesModel) => {
        setCellModesModel(newModel);
    }, []);

    const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
        if (newRow["description"] === oldRow["description"]) {
            return oldRow;
        }
        newRow["description"] = newRow["description"].toUpperCase()
        const mergeFilteredItems = changeOrderItems.map((orderItem) => {

            return orderItem.id === newRow["id"] ? newRow as any : orderItem
        });
        //Actualizamos cantidades modificadas 
        setChangeOrderItems(mergeFilteredItems);

        return newRow;
    }

    useEffect(() => {
        setRightOrderData({
            ...rightOrder,
            customerCompanyId: leftOrder.customerCompanyId,
            customerName: leftOrder.customerName
        })
        return () => {
            setRightOrderData({
                ...rightOrder,
                customerCompanyId: leftOrder.customerCompanyId,
                customerName: leftOrder.customerName
            })
        }
    }, [])


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
            if (changeOrderItems.some(or => !(or.envioSri))) {
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

            const mergeLeftIntoRightOrder = {
                ...rightOrder,
                establecimientoId: leftOrder.establecimientoId,
                puntoEmisionId: leftOrder.puntoEmisionId,
                tableId: leftOrder.tableId,
            }

            const orderResult = summaryToApi(mergeLeftIntoRightOrder);
            const orderItemsResult = itemToApi(changeOrderItems);

            const data = {
                ...orderResult,
                subtotalSinImpuestos: objTempTotal.subTotalSinImpuestos,
                tax: objTempTotal.tax,
                total: objTempTotal.total,
                updateOrder: false,
                saveDoc: true,
                codDoc: DOC_TYPE.FV,
                quickSale: true,
                items: orderItemsResult,
                // itemsToPay: orderItemsResult,
                customDetail: orderItemsResult
            }


            showLoader()
            orderService.put(leftOrder.orderId, data).then(response => {
                hideLoader()
                if (response.code === '0') {
                    SnackbarUtility.warning(response.message)
                }
                if (response.code === "1") {
                    SnackbarUtility.success(response.message);
                    const queryParams = JSON.parse(response.payload)[0];

                    resetData();
                    setPaymentData({
                        open: true,
                        payload: queryParams
                    })
                    setActionType("CUSTOM_DETAIL")
                    setOpen();
                }
            })
                .catch(() => hideLoader())
        } catch (error) {
            console.log(error)
        }
    }

    const closeModal = () => {
        setActionType("")
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
                        <CustomerSearch
                            customerCompanyId={rightOrder.customerCompanyId}
                            customerName={leftOrder.customerName}
                            onChangeCustomer={(data) => {
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
                        sx={{
                            boxShadow: 2,
                            border: 2,
                            borderColor: 'primary.light',
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main',
                            },
                        }}
                        rows={changeOrderItems}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        columnVisibilityModel={columnVisibilityModel}
                        onColumnVisibilityModelChange={(newModel) =>
                            setColumnVisibilityModel(newModel)
                        }
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
                        <Button color='success' disabled={loader} variant='contained' sx={{
                            height: 60
                        }} size='large' fullWidth onClick={saveAsInvoice} >
                            <SaveIcon />
                            Factura
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button color='inherit' disabled={loader} variant='outlined' sx={{
                            height: 60
                        }} size='large' fullWidth onClick={() => {
                            setRightOrderData({
                                ...rightOrder,
                                obs: ""
                            })
                            closeModal()
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
