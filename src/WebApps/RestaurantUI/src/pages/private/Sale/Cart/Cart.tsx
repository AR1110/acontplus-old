import { Box, Button, Divider, Grid, List, Paper, TextField, Typography } from '@mui/material'
import CartItem from '../CartItem/CartItem'
import { useCheckoutStore, useLoaderStore, useSaleStore } from '@/stores';
import Swal from 'sweetalert2';
import { SnackbarUtility } from '@/core/utilities';
import { itemToApi, summaryToApi } from '@/core/adapters';
import { OrdenService, SharedService } from '@/core/services';
import { QueryParams } from '@/core/models';
import { AddShoppingCartIcon, CleaningServicesIcon, FileCopyRoundedIcon, SaveIcon } from '@/core/components';
import { DOC_TYPE } from '@/core/constants';
import './Cart.css'
import TableDialog from '../Table/TableDialog';
import { useState } from 'react'; 
import CustomerSearch from '../Customer/CustomerSearch';


const Cart = () => {
    const cartItems = useSaleStore(state => state.items);
    const { order } = useSaleStore(state => ({
        order: state.order,
        items: state.items,
    }));
    const setOrder = useSaleStore(state => state.setSummary)

    //store checkout 
    const setQueryParams = useCheckoutStore(state => state.setQueryParams)

    const resetForm = useSaleStore(state => state.resetForm);
    const payment = useSaleStore(state => state.payment);

    const { showLoader } = useLoaderStore();

    //Modal Tables 
    const [openTableDialog, setOpenTableDialog] = useState(false);
    const typeActions: { [key: string]: string } = {
        [DOC_TYPE.FV]: `
        Esta seguro de guardar el pedido como Factura? </br> 
        <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
        [DOC_TYPE.NE]: `
        Esta seguro de guardar el pedido como Nota de Entrega? </br> 
        <small>Ya no será posible modificar la venta para hacer cambios, tendrás que cancelar esta y crear una nueva.!</small>`,
        [DOC_TYPE.OR]: `Esta seguro de guardar el pedido? </br>
        <small>El stock de los productos <strong>no se descontará</strong> hasta que se transforme a "Factura" o "Nota de Entrega".`

    }

    const onClickResetFrom = async () => {
        if (cartItems.length === 0) return;
        const { isConfirmed } = await Swal.fire({
            title: 'Limpiar',
            html: '<small>¿Está seguro de que desea restablecer el producto ?</small>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, restablecer',
            // confirmButtonColor: '#3085d6',            
            cancelButtonText: 'No, cancelar'
        })
        if (isConfirmed) {
            resetForm();
        }
    }
    const askToSave = async function (codDoc: string) {


        // setVoucher({
        //     payingAmount: summary.total,
        //     receivedAmount: summary.total.toString(),
        //     changeReturn: 0,
        //     creationDate: new Date()
        // });
        // payment.openDialogCustom();

        // if(!(summary.customerCompanyId > 0)){
        //     SnackbarUtility.warning('Seleccione el cliente');
        //     return
        // }
        if (!(order.tableId > 0)) {
            SnackbarUtility.warning('Seleccione la Mesa');
            return
        }
        if (cartItems.length === 0) {
            SnackbarUtility.warning('Agregue Item');
            return
        }
        const { isConfirmed } = await Swal.fire({
            title: `${order.orderId > 0 ? 'Actualizar' : 'Guardar'} Pedido`,
            html: typeActions[codDoc],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `${order.orderId > 0 ? 'Actualizar' : 'Guardar'}`,
            cancelButtonText: 'No, cancelar!'
        })

        if (!isConfirmed) return

        const summaryResult = summaryToApi(order);
        const itemsResult = itemToApi(cartItems);
        const taxesResult = cartItems.flatMap(item => item.taxes);
        // const payments = {
        //     formaPagoId: dataForm.paymentTypes.find(pay=>pay.code==="EFE")?.paymentTypeId,
        //     total: checkout.voucher.payingAmount,
        //     abono: checkout.voucher.receivedAmount,
        //     cambio: checkout.voucher.changeReturn
        // }
        const data = {
            ...summaryResult,
            updateOrder: (order.orderId > 0) && codDoc === DOC_TYPE.OR,
            saveDoc: (codDoc === DOC_TYPE.FV) || (codDoc === DOC_TYPE.NE),
            codDoc,
            quickSale: (codDoc === DOC_TYPE.FV) || (codDoc === DOC_TYPE.NE),
            items: itemsResult,
            taxes: taxesResult,
            payments: {}
        }
        if (order.orderId > 0) {
            showLoader(true);
            OrdenService.put(order.orderId, data).then(response => {
                if (response.code === '0') {
                    SnackbarUtility.warning(response.message)
                }
                if (response.code === "1") {
                    SnackbarUtility.success(response.message);
                    const queryParams: QueryParams = JSON.parse(response.payload)[0];
                    console.log(queryParams)
                }
            }).finally(() => showLoader(false))
        } else {
            showLoader(true);
            OrdenService.post(data).then(response => {
                showLoader(false)
                if (response.code === '0') {
                    SnackbarUtility.warning(response.message)
                }
                if (response.code === "1") {
                    SnackbarUtility.success(response.message);
                    console.log(response)
                    //Order 
                    if (codDoc === DOC_TYPE.OR) {
                        resetForm();
                        return
                    }
                    const queryParams: QueryParams = JSON.parse(response.payload)[0];

                    if (queryParams.payAutomatic) {
                        setQueryParams(queryParams);
                        payment.openDialogCustom();
                        return
                    }


                    if (queryParams.printerAutomatic) {
                        SharedService.getPrinter(queryParams.idDocumento)
                    } else {
                        resetForm();
                    }
                }
            }).finally(() => showLoader(false))
        }


    }


    return (
        <Paper elevation={0} sx={{
            borderRadius: '12px',
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            maxHeight: 550,
            bgcolor: 'background.paper'
        }} >
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                <Box gridColumn="span 8">
                    {/* <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1, sm: 2, md: 4 }}

                    >
                        <Box> */}
                        <CustomerSearch/>
                        {/* </Box>
                        <Box>
                            <ButtonGroup variant="outlined" aria-label="outlined button group">
                                <Button>One</Button>
                                <Button>Two</Button>
                            </ButtonGroup>
                        </Box>

                    </Stack> */}
                </Box>
                <Box gridColumn="span 4" textAlign="end">
                    <Button variant="outlined" onClick={() => {
                        setOpenTableDialog(true)
                    }}>
                        {
                            order.tableId > 0 ? (
                                (
                                    order.table?.description && order.table?.description
                                ) ? `${order.table?.description} - ${order.table?.numberTable}` : 'Seleccionar Mesa'
                            ) : 'Mesa'
                        }
                    </Button>
                    <TableDialog open={openTableDialog} onClose={setOpenTableDialog} />
                </Box> 
            </Box> 
            {
                cartItems.length === 0 ? (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>

                    <AddShoppingCartIcon sx={{
                        height: "5rem!important",
                        width: '5rem',
                        color: 'rgba(59, 130, 246, 0.5)'
                    }} />

                    <Typography color="text.secondary" variant="caption"></Typography>
                </div>) : (

                    <List sx={{ width: '100%', maxHeight: 300, overflowY: 'auto', bgcolor: 'background.paper' }}>
                        {cartItems.map((item, index) => (
                            <CartItem item={item} index={index} key={index} />
                        ))}
                    </List>

                )
            }

            <Divider sx={{ m: 1 }} />
            <Grid container direction="row"
                justifyContent="space-between"
                alignItems="center" >

                <Grid item  >
                    <TextField
                        id="observacion"
                        label="Observación"
                        value={order.obs}
                        onChange={(e) => {
                            setOrder({
                                ...order,
                                obs: e.target.value
                            })
                        }}
                        multiline
                        rows={2}
                    />
                </Grid>
                <Grid item >
                    <Typography variant="subtitle1" color="text.primary">
                        SubTotal: ${order.subTotalSinImpuestos.toFixed(2)}
                    </Typography>
                    <Typography variant="subtitle1" color="text.primary">
                        IVA (12%): ${order.tax.toFixed(2)}
                    </Typography>
                    <Typography variant="h6" color="error">
                        Total: ${order.total.toFixed(2)}
                    </Typography>
                </Grid>
            </Grid>
            <Divider sx={{ m: 1 }} />



            <Grid container spacing={1} justifyContent="stretch"   >
                {
                    order.orderId > 0 && (
                        <>
                            <Grid item xs={6} md={6}>
                                <Button
                                    color="error"
                                    className='buttonCart'
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={<CleaningServicesIcon />}
                                    onClick={onClickResetFrom}>
                                    Limpiar
                                    <Typography variant="caption" display="block" gutterBottom>
                                        Alt + C
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <Button
                                    color="success"
                                    className='buttonCart'
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={<SaveIcon />}
                                    onClick={() => askToSave(DOC_TYPE.OR)}>
                                    Actualizar
                                </Button>
                            </Grid>
                        </>
                    )
                }

                {
                    !(order.orderId > 0) && (
                        <>
                            <Grid item xs={6} md={3}>
                                <Button
                                    color="error"
                                    className='buttonCart'
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={<CleaningServicesIcon />}
                                    onClick={onClickResetFrom}>
                                    Limpiar
                                    <Typography variant="caption" display="block" gutterBottom>
                                        Alt + C
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Button
                                    color="success"
                                    className='buttonCart'
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={<SaveIcon />}
                                    onClick={() => askToSave(DOC_TYPE.OR)}>
                                    Guardar
                                </Button>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Button
                                    color="primary"
                                    className='buttonCart'
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={<FileCopyRoundedIcon />}
                                    onClick={() => askToSave(DOC_TYPE.FV)}>
                                    Factura
                                </Button>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Button
                                    color="warning"
                                    className='buttonCart'
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={<FileCopyRoundedIcon />}
                                    onClick={() => askToSave(DOC_TYPE.NE)}>

                                    Nota Entrega
                                </Button>
                            </Grid>
                        </>
                    )
                }
            </Grid>
        </Paper>
    )
}

export default Cart


