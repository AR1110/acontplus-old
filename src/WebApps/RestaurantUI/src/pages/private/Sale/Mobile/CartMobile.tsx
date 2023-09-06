
import CartMobileAction from './CartMobileActions'
import { Box, Button, List, ListItem, TextField, Typography, useTheme } from '@mui/material';
import { AddShoppingCartIcon } from '@/core/components';
import { useSaleStore } from '@/stores';
import { useState } from 'react';
import TableDialog from '../Table/TableDialog';
import CartItem from '../CartItem/CartItem';

const CartMobile = () => {
    const theme = useTheme();
    const orderItems = useSaleStore(state => state.items);
    const order = useSaleStore(state => state.order);
    const setOrder = useSaleStore(state => state.setSummary)

    //Modal Tables 
    const [openTableDialog, setOpenTableDialog] = useState(false);

    if (orderItems.length === 0) {
        return (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>

            <AddShoppingCartIcon sx={{
                height: "5rem!important",
                width: '5rem',
                color: 'rgba(59, 130, 246, 0.5)'
            }} />

            <Typography color="text.secondary" variant="caption"></Typography>
        </div>)
    }

    return (
        <>
            <div style={{ minHeight: '100vh', position: 'relative', overflowY: 'auto', maxHeight: '100vh' }}>

                <Button variant="outlined" onClick={() => {
                    setOpenTableDialog(true)
                }}>
                    {
                        order.tableId > 0 ? (
                            (
                                order.table?.description && order.table?.description
                            ) ? `${order.table?.description} - ${order.table?.numberTable}` : 'Seleccionar Mesa'
                        ) : 'Seleccionar Mesa'
                    }
                </Button>
                <TableDialog open={openTableDialog} onClose={setOpenTableDialog} />

                <List>
                    {
                        orderItems.map((orderItem, index) => (
                            <ListItem key={index} children={
                                <CartItem item={orderItem} index={index} key={index} />
                            } />

                        ))
                    }
                </List>
            </div>

            <CartMobileAction />
            {/* Content to stick to the bottom */}
            {/* position: 'absolute', */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    backgroundColor: theme.palette.mode === 'dark'? '#1A2027' : 'white',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <TextField fullWidth size='small'
                    id="observacion"
                    label="Observación"
                    value={order.obs}
                    onChange={(e) => {
                        setOrder({
                            ...order,
                            obs: e.target.value
                        })
                    }}
                />
                <Box
                    sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >

                    <Box>
                        <Typography variant="body2" color="text.primary">
                            <b>Subtotal: </b>
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                            <b>IVA: </b>
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                            <b>Importe Total: </b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.primary">
                            ${order.subTotalSinImpuestos}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                            ${order.tax}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                            ${order.total}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default CartMobile