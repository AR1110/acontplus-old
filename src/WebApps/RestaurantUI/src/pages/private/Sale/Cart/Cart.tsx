import { Box, Button, ButtonGroup, ClickAwayListener, Divider, Grid, Grow, List, ListItem, ListItemText, MenuItem, MenuList, Paper, Popper, Typography } from '@mui/material'
import CartItem from '../CartItem/CartItem'
import { useAuthStore, useCheckoutStore, useLoaderStore, useSaleStore } from '@/stores';
import CustomerSearch from '../components/CustomerSearch';
import TableSelect from '../components/TableSelect';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { SnackbarUtility } from '@/core/utilities';
import { itemToApi, summaryToApi } from '@/core/adapters';
import { OrdenService, SharedService } from '@/core/services';
import { QueryParams } from '@/core/models';
import { AddShoppingCartIcon, ArrowDropDownIcon, RestartAltIcon, SaveIcon } from '@/core/components';
import { DOC_TYPE } from '@/core/constants';

const styleListItem = {
    paddingTop: '2px',
    paddingBottom: '2px'
}

const Cart = () => {
    const cartItems = useSaleStore(state => state.items);
    const { order, dataForm } = useSaleStore(state => ({
        order: state.order,
        items: state.items,
        dataForm: state.dataForm
    }));

    //store checkout 
    const { setVoucher, setQueryParams } = useCheckoutStore(state => ({
        setVoucher: state.setVoucher,
        setQueryParams: state.setQueryParams
    }))

    const resetForm = useSaleStore(state => state.resetForm);
    const payment = useSaleStore(state => state.payment);
    const dataEstab = useAuthStore(state => state.dataEstab);

    const { showLoader } = useLoaderStore();
    //Options Save
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const onClickResetFrom = async () => {
        if (cartItems.length === 0) return;
        const { isConfirmed } = await Swal.fire({
            title: 'Reiniciar',
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



    //Cart Footer
    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    const handleToggle = () => {
        console.log('toggle')
        setOpen((prevOpen) => !prevOpen);
    };


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
            title: 'Guardar el Orden?',
            text: "Ya no será posible modificar la venta - para hacer cambios, tendrás que cancelar esta y crear una nueva.!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, guardar!',
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
            saveDoc: (codDoc ===DOC_TYPE.FV) || (codDoc=== DOC_TYPE.NE),
            codDoc,
            quickSale: (codDoc ===DOC_TYPE.FV) || (codDoc=== DOC_TYPE.NE),
            items: itemsResult,
            taxes: taxesResult,
            payments: {}
        }
        if(order.orderId > 0){
            showLoader(true);
            OrdenService.put(order.orderId, data).then(response=>{
                if (response.code === '0') {
                    SnackbarUtility.warning(response.message)
                }
                if (response.code === "1") {
                    SnackbarUtility.success(response.message); 
                    const queryParams: QueryParams = JSON.parse(response.payload)[0];
                    console.log(queryParams)
                }
            }).finally(()=>showLoader(false))
        }else{
            showLoader(true);
            OrdenService.post(data).then(response => {
                showLoader(false)
                if (response.code === '0') {
                    SnackbarUtility.warning(response.message)
                }
                if (response.code === "1") {
                    SnackbarUtility.success(response.message);
                    const queryParams: QueryParams = JSON.parse(response.payload)[0];
                   
                    //Order 
                    if (codDoc ===DOC_TYPE.OR) {
                        resetForm();
                        return
                    }
    
                    if (queryParams.payAutomatic) {
                        setQueryParams(queryParams);
                        payment.openDialogCustom();
                        return
                    }
    
    
                    if (queryParams.printerAutomatic) {
                        SharedService.getPrinter(1)
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
            <Grid container
                direction="row"
                justifyContent="space-between"
                alignItems="center">
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <CustomerSearch />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={5}>
                    <TableSelect />
                </Grid>
            </Grid>

            {
                cartItems.length === 0 ? (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <AddShoppingCartIcon sx={{
                        height: "5rem!important",
                        width: '5rem',
                        color: 'rgba(59, 130, 246, 0.5)'
                    }} />

                    <Typography color="text.secondary" variant="caption"></Typography>
                </div>) : (

                    <List sx={{ width: '100%', maxHeight: 300, overflowY: 'auto', pb: 5, bgcolor: 'background.paper' }}>
                        {cartItems.map((item, index) => (
                            <CartItem item={item} index={index} key={index} />

                        ))}
                    </List>

                )
            }


            {/* Totals */}
            <List>
                <Divider />
                <ListItem sx={styleListItem}>
                    <ListItemText>
                        <Typography variant="subtitle2" gutterBottom>
                            SubTotal
                        </Typography>
                    </ListItemText>
                    <Typography variant="subtitle2">${order.subTotalSinImpuestos.toFixed(2)}</Typography>

                </ListItem>
                <ListItem sx={styleListItem}>
                    <ListItemText>
                        <Typography variant="subtitle2" gutterBottom>
                            IVA (12%)
                        </Typography>
                    </ListItemText>
                    <Typography variant="subtitle2">${order.tax.toFixed(2)}</Typography> 
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText>
                        <Typography variant="h6" gutterBottom>
                            Total
                        </Typography>
                    </ListItemText>
                  
                    <Typography color="error" variant="h6" gutterBottom>${order.total.toFixed(2)}</Typography> 
                </ListItem>
            </List>
            {/**End totals */}
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Grid container spacing={2} columns={16}>
                    <Grid item xs={16} md={6} lg={6}>
                        <Button color="error" variant="contained" size="large" fullWidth startIcon={<RestartAltIcon />} onClick={onClickResetFrom} sx={{
                            height: 50
                        }}>
                            Limpiar
                        </Button>
                    </Grid>
                    <Grid item xs={16} md={10} lg={10}>
                        {/* <Button color="success" disabled={items.length===0} variant="contained" size="large" onClick={()=>askToSave()} fullWidth endIcon={<ArrowForwardIosIcon />}>
                            Ir a pago
                        </Button> */}
                        <ButtonGroup variant="contained" color='success' ref={anchorRef} aria-label="split button" fullWidth size='large' sx={{
                            height: 50,
                        }}>
                            <Button startIcon={<SaveIcon />} onClick={() => askToSave(DOC_TYPE.OR)}>

                                {
                                    order.orderId > 0 ? 'Actualizar' : 'Guardar'
                                }

                            </Button>
                            <Button
                                size="small"
                                aria-controls={open ? 'split-button-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-label="select merge strategy"
                                aria-haspopup="menu"
                                onClick={handleToggle}
                            >
                                <ArrowDropDownIcon />
                            </Button>
                        </ButtonGroup>
                        <Popper
                            sx={{
                                zIndex: 1,
                            }}
                            open={open}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            transition
                            disablePortal
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === 'bottom' ? 'center top' : 'center bottom',
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList id="split-button-menu" autoFocusItem>
                                                <MenuItem onClick={() => askToSave(DOC_TYPE.FV)}>Factura</MenuItem>
                                                <MenuItem onClick={() => askToSave(DOC_TYPE.NE)}>Nota Entrega</MenuItem>

                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </Grid>
                </Grid>
            </Box>

        </Paper>
    )
}

export default Cart