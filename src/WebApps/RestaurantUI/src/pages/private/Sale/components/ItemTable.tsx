
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Avatar, Grid, IconButton, TextField, Typography } from '@mui/material';
import { AddShoppingCartIcon, DeleteIcon } from '@/core/components';
import { saleStore } from '@/stores/saleStore';

export default function ItemaTable() {
    const cartItems = saleStore(state => state.cartItems);
    const removeItemFromCart = saleStore(state => state.removeItemFromCart)
    const setItemChangeQty = saleStore(state => state.setItemChangeQty)

    if (cartItems.length === 0) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <AddShoppingCartIcon sx={{
                height: "5rem!important",
                width: '5rem',
                color: 'rgba(59, 130, 246, 0.5)'
            }} />

            <Typography color="text.secondary" variant="caption"></Typography>
        </div>
    )

    // const getWarehouseId = ()=>{
    //     let warehouses: Array<WarehouseAsign> = dataForm.warehouses.filter(warehouse => warehouse.codEstab_Asig === dataEstab.codEstab_Asig);

    //     let dataWarehouse = {} as WarehouseAsign
    //     if (warehouses.length > 0) {
    //         dataWarehouse = warehouses.find(warehouse => (warehouse.defaultBodega)) as WarehouseAsign
    //     } else {
    //         SnackbarUtility.warning('No tienes bodegas asignadas')
    //         return
    //     }
    // }

    const onChangeQty = function(){

    }


    return (
        <TableContainer sx={{ maxHeight: 300 }} component={Paper}>
            <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell align="center">Cant.</TableCell>
                        <TableCell align="right">Precio</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cartItems.map((item, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align='left'>
                                <Grid container wrap="nowrap" spacing={1}>
                                    <Grid item>
                                        <Avatar src={item.s3ObjectUrl}>W</Avatar>
                                    </Grid>
                                    <Grid item xs zeroMinWidth>
                                        <Typography component="span" color='text.secondary' variant='caption' sx={{
                                            wordBreak: 'break-all',
                                            fontSize: '10px'
                                        }}>
                                            {item.name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell align="center" style={{ minWidth: 10 }}>
                                <TextField
                                    type="number"
                                    value={item.qty}
                                    id="amount"
                                    name="amount"
                                    variant="outlined"
                                    onChange={(event) => setItemChangeQty(event, item)}
                                    inputProps={
                                        {
                                            style: {
                                                textAlign: 'center',
                                                padding: '4px',
                                                width: '100%',
                                                fontSize: '5'
                                            }
                                        }
                                    }
                                    size="small"
                                // Add other TextField props here as needed
                                />

                            </TableCell>
                            <TableCell align="right">${item.sellingPrice}</TableCell>
                            <TableCell align="right">${item.totalPrice}</TableCell>
                            <TableCell align="center">
                                <IconButton color='error' size="small" aria-label="delete" onClick={() => removeItemFromCart(item.productId)}>
                                    <DeleteIcon fontSize="inherit" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </TableContainer>

    );
}
