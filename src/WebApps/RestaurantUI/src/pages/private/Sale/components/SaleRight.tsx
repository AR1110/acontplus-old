import {
    Box,
    Button,
    ButtonGroup,
    ClickAwayListener,
    Divider, Grid, Grow, List, ListItem, ListItemText, MenuItem, MenuList, Paper, Popper, Typography, useMediaQuery
} from '@mui/material'

import CustomerSearch from './CustomerSearch'
import { ArrowDropDownIcon, ArrowForwardIosIcon, RestartAltIcon, SaveIcon } from '@/core/components'
import TableSelect from './TableSelect';
import { useSaleStore } from '@/stores/saleStore'
import Swal from 'sweetalert2'
import { SnackbarUtility } from '@/core/utilities'
import { itemToApi, summaryToApi } from '@/core/adapters'
import { useAuthStore, useCheckoutStore, useLoaderStore } from '@/stores'
import { OrdenService } from '@/core/services'
import CartTable from '../Cart/CartTable'
import { useRef, useState } from 'react'; 
import { QueryParams } from '@/core/models';

const listItemCustom = {
    paddingTop: '2px',
    paddingBottom: '2px'
}



export default function SaleRight() {
    const isMobile = useMediaQuery('(max-width:900px)');


    const { summary, items, dataForm } = useSaleStore(state => ({
        summary: state.summary,
        items: state.items,
        dataForm: state.dataForm
    }));

    //store checkout 
    const {setVoucher, setQueryParams} = useCheckoutStore(state => ({
        setVoucher: state.setVoucher, 
        setQueryParams: state.setQueryParams
    }))

    const resetForm = useSaleStore(state => state.resetForm);
    const payment = useSaleStore(state => state.payment);
    const dataEstab = useAuthStore(state => state.dataEstab);

    const {showLoader}  = useLoaderStore();
    //Options Save
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const onClickResetFrom = async () => {
        if (items.length === 0) return;
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


    const askToSave = async function () {
       

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
        if(!(summary.tableId>0)){
            SnackbarUtility.warning('Seleccione la Mesa');
            return
        }
        if(items.length===0){
            SnackbarUtility.warning('Agregue Item');
            return
        }
        const {isConfirmed} = await Swal.fire({
            title: 'Guardar el Orden?',
            text: "Ya no será posible modificar la venta - para hacer cambios, tendrás que cancelar esta y crear una nueva.!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, guardar!',
            cancelButtonText: 'No, cancelar!'
        })

        if(!isConfirmed) return
        
            const summaryResult = summaryToApi(summary);
            const itemsResult = itemToApi(items);
            const taxesResult = items.flatMap(item=>item.taxes);
            // const payments = {
            //     formaPagoId: dataForm.paymentTypes.find(pay=>pay.code==="EFE")?.paymentTypeId,
            //     total: checkout.voucher.payingAmount,
            //     abono: checkout.voucher.receivedAmount,
            //     cambio: checkout.voucher.changeReturn
            // }
            const data = {
                ...summaryResult,
                items: itemsResult,
                taxes: taxesResult,
                payments: {}
            }
            showLoader(true);
            OrdenService.post(data).then(response => {
                console.log(response)
                if (response.code === '0') {
                    SnackbarUtility.warning(response.message)
                }
                if (response.code === "1") {     
                    const queryParams: QueryParams = JSON.parse(response.payload)[0];
                    console.log(queryParams)
                    setQueryParams(queryParams);
                    SnackbarUtility.success(response.message);
                    payment.openDialogCustom();                    
                   // resetForm();
                }
            }).finally(()=>showLoader(false))

    }

    return (
        <Paper elevation={isMobile ? 0 : 0} sx={{
            borderRadius: isMobile ? 'none' : '12px',
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
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

            <CartTable />

            {/* Totals */}
            <List>
                <Divider />
                <ListItem sx={listItemCustom}>
                    <ListItemText>
                        <Typography variant="subtitle2" gutterBottom>
                            SubTotal
                        </Typography>
                    </ListItemText>
                    <Typography variant="subtitle2">${summary.total.toFixed(2)}</Typography>

                </ListItem>
                <ListItem sx={listItemCustom}>
                    <ListItemText>
                        <Typography variant="subtitle2" gutterBottom>
                            IVA (12%)
                        </Typography>
                    </ListItemText>
                    <Typography variant="subtitle2">${summary.taxAmount.toFixed(2)}</Typography>
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText>
                        <Typography variant="h6" gutterBottom>
                            Total
                        </Typography>
                    </ListItemText>
                    <Typography color="error" variant="h6" gutterBottom>${summary.netTotal.toFixed(2)}</Typography>
                </ListItem>
            </List>
            {/**End totals */}
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Grid container spacing={2} columns={16}>
                    <Grid item xs={16} md={8} lg={8}>
                        <Button color="error" variant="contained" size="large" fullWidth startIcon={<RestartAltIcon />} onClick={onClickResetFrom} sx={{
                            height: 50
                        }}>
                            Limpiar
                        </Button>
                    </Grid>
                    <Grid item xs={16} md={8} lg={8}>
                        {/* <Button color="success" disabled={items.length===0} variant="contained" size="large" onClick={()=>askToSave()} fullWidth endIcon={<ArrowForwardIosIcon />}>
                            Ir a pago
                        </Button> */}
                        <ButtonGroup variant="contained" color='success' ref={anchorRef} aria-label="split button" fullWidth size='large' sx={{
                            height: 50, 
                        }}>
                            <Button startIcon={<SaveIcon />} onClick={askToSave}>Guardar</Button>
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
                                                <MenuItem>Factura</MenuItem>
                                                <MenuItem>Nota Entrega</MenuItem>

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
