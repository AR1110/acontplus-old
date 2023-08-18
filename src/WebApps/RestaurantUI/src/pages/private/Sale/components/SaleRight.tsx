import { 
    Box, 
    Button,
    Divider, Grid, List, ListItem, ListItemText, Paper, Typography, useMediaQuery } from '@mui/material'

import CustomerSearch from './CustomerSearch'
import { RestartAltIcon, SaveIcon } from '@/core/components'
import TableSelect from './TableSelect'
import ItemaTable from './ItemTable'
import { saleStore } from '@/stores/saleStore'
import Swal from 'sweetalert2'

const listItemCustom = {
    paddingTop: '2px',
    paddingBottom: '2px'
}



export default function SaleRight() {
    const isMobile = useMediaQuery('(max-width:900px)');
    const {summary, cartItems, dataForm} = saleStore(state => ({
        summary: state.summary,
        cartItems: state.cartItems,
        dataForm: state.dataForm
    }));
    const resetForm = saleStore(state => state.resetForm);

    const askToSave = async function(){
        let {isConfirmed} = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })

        if(isConfirmed){
            
            // itemId INT '$.itemId',
            //             taxId INT '$.taxId',
            //             taxPercentId INT '$.taxPercentId',
            //             taxValue INT'$.taxValue',
            //             quantity NUMERIC (18,5) '$.quantity',
            //             cost NUMERIC(18,5) '$.cost',
            //             price NUMERIC(18,5) '$.price',
            //             discount NUMERIC(18,5) '$.discount',
            //             total NUMERIC(18,5) '$.total'
            console.log(dataForm)
            console.log(cartItems)
            console.log(summary)

        }

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
                        <Button color="error" variant="contained" size="large" fullWidth endIcon={<RestartAltIcon />} onClick={resetForm}>
                            Limpiar
                        </Button>
                    </Grid>
                    <Grid item xs={16} md={8} lg={8}>
                        <Button color="success" disabled={cartItems.length===0} variant="contained" size="large" onClick={()=>askToSave()} fullWidth endIcon={<SaveIcon />}>
                            Guardar
                        </Button>
                    </Grid>
                </Grid>
            </Box>

        </Paper>
    )
}
