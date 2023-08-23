import { 
    Box, 
    Button,
    Divider, Grid, List, ListItem, ListItemText, Paper, Typography, useMediaQuery } from '@mui/material'

import CustomerSearch from './CustomerSearch'
import { ArrowForwardIosIcon, RestartAltIcon, SaveIcon } from '@/core/components'
import TableSelect from './TableSelect'
import ItemaTable from './ItemTable'
import { useSaleStore } from '@/stores/saleStore'
import Swal from 'sweetalert2'
import { SnackbarUtility } from '@/core/utilities'
import { summaryToApi } from '@/core/adapters'
import { useAuthStore, useCheckoutStore } from '@/stores'
import { OrdenService } from '@/core/services'

const listItemCustom = {
    paddingTop: '2px',
    paddingBottom: '2px'
}



export default function SaleRight() {
    const isMobile = useMediaQuery('(max-width:900px)');
    const {summary, items, dataForm} = useSaleStore(state => ({
        summary: state.summary,
        items: state.items,
        dataForm: state.dataForm        
    }));
    const {dataEstab} = useAuthStore(state => ({
        dataEstab: state.dataEstab
    }));

    //store checkout 
    const setVoucher = useCheckoutStore(state=>state.setVoucher)

    const resetForm = useSaleStore(state => state.resetForm);
    const payment = useSaleStore(state=>state.payment);

    const onClickResetFrom =async () => {
        if(items.length===0) return; 
        const {isConfirmed} = await Swal.fire({
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
        if(isConfirmed){
            resetForm();
        }
    }

    const askToSave = async function(){
        setVoucher(summary.total, summary.total.toString(), 0);
        payment.openDialogCustom();
        // if(!(summary.customerCompanyId > 0)){
        //     SnackbarUtility.warning('Seleccione el cliente');
        //     return
        // }
        // if(!(summary.tableId>0)){
        //     SnackbarUtility.warning('Seleccione la Mesa');
        //     return
        // }
        // if(items.length===0){
        //     SnackbarUtility.warning('Agregue');
        //     return
        // }
        // const {isConfirmed} = await Swal.fire({
        //     title: 'Are you sure?',
        //     text: "You won't be able to revert this!",
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#3085d6',
        //     cancelButtonColor: '#d33',
        //     confirmButtonText: 'Yes, delete it!'
        // })

        // if(isConfirmed){
        //     console.log(dataForm.emissionPoints)
        //     summary.establecimientoId = dataEstab.idEstablecimiento;
        //     summary.puntoEmisionId = dataForm.emissionPoints.find(
        //         pto=>pto.codEstab_Asig===dataEstab.codEstab_Asig && (pto.predeterminado)
        //     )?.idPuntoEmision ?? 0
        //     const data = summaryToApi(summary, items)
            
        //     OrdenService.post(data).then(response=>{
        //         console.log(response)
        //         if(response.code==='0'){
        //             SnackbarUtility.warning(response.message)
        //         }
        //         if(response.code==="1"){                    
        //             SnackbarUtility.success(response.message)
        //             resetForm();
        //         }
        //     })
        // }

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

            <ItemaTable />

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
                        <Button color="error" variant="contained" size="large" fullWidth endIcon={<RestartAltIcon />} onClick={onClickResetFrom}>
                            Limpiar
                        </Button>
                    </Grid>
                    <Grid item xs={16} md={8} lg={8}>
                        <Button color="success" disabled={items.length===0} variant="contained" size="large" onClick={()=>askToSave()} fullWidth endIcon={<ArrowForwardIosIcon />}>
                            Ir a pago
                        </Button>
                    </Grid>
                </Grid>
            </Box>

        </Paper>
    )
}
