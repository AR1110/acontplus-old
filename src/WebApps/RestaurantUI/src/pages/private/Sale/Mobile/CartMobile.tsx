
import CartMobileAction from './CartMobileActions'
import { Box, TextField, Typography, useTheme } from '@mui/material';
import { AddShoppingCartIcon } from '@/core/components/IconsMaterial';
import { useSaleStore } from '@/stores'; 
import CustomerSearch from '../Customer/CustomerSearch';
import ShoppingCart from '../components/ShoppingCart';

const CartMobile = () => {
    const theme = useTheme();
    const orderItems = useSaleStore(state => state.items);
    const order = useSaleStore(state => state.order);
    const setOrder = useSaleStore(state => state.setSummary)



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
            <div >
                <CustomerSearch />
                {
                    orderItems.map((orderItem, index) => (
                        <ShoppingCart item={orderItem} index={index} key={index} />
                        // <CartItem item={orderItem} index={index} key={index} />
                    ))
                }
            </div>

            <CartMobileAction />
            <Box
                sx={{

                    bottom: '0',
                    left: '0',
                    right: '0',
                    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'white',
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
                    multiline
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