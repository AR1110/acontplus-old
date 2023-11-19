 
import { styled, Card, CardContent, CardMedia, Typography, IconButton, Button, Grid, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RoundNumber } from '@/core/utilities';
import { ItemRead } from '@/core/models';
import { useSaleStore, useStoreCartSidebar } from '@/stores';

const StyledCard = styled(Card)({
    margin: '10px 0',
    cursor: 'pointer'
});

const StyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
});

const StyledTypographyH4 = styled(Typography)(({ theme }) => ({
    fontSize: '14px', 
    margin: '5px 0',
    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.between('sm', 'md')]: {
        maxWidth: '90px',
        fontSize: '12px',
    },
    [theme.breakpoints.between('md', 'lg')]: {
        fontSize: '12px',
        maxWidth: '200px',
    },
    [theme.breakpoints.up('lg')]: {
        maxWidth: '300px',
    },
}));

const StyledTypographyBody = styled(Typography)(({ theme }) => ({
    color: '#a1a1a1',
    fontSize: '14px',
    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.between('sm', 'md')]: {
        maxWidth: '90px',
        fontSize: '12px',
    },
    [theme.breakpoints.between('md', 'lg')]: {
        fontSize: '12px',
        maxWidth: '200px',
    },
    [theme.breakpoints.up('lg')]: {
        maxWidth: '300px',
    },
}));

const StyledIconButton = styled(IconButton)({
    alignSelf: 'flex-end',
    marginLeft: 'auto', // Alinea el icono en la esquina superior derecha
    color: '#dc3545',
    '&:hover': {
        color: '#c82333',
    },
});

const StyledButtonPlus = styled(Button)({
    fontSize: '20px',
    lineHeight: '30px',
    width: '30px',
    textAlign: 'center',
    background: '#28a745',
    border: 'none',
    height: '100%',
    padding: '0 15px',
    '&:hover': {
        background: '#218838',
        color: '#fff',
        cursor: 'pointer',
    },
    
});

const StyledButtonMinus = styled(Button)({
    fontSize: '20px',
    lineHeight: '30px',
    width: '30px',
    textAlign: 'center',
    background: '#dc3545',
    border: 'none',
    height: '100%',
    padding: '0 15px',
    '&:hover': {
        background: '#c82333',
        color: '#fff',
        cursor: 'pointer',
    },
});

type CartItemProps = {
    index: number
    item: ItemRead
}
const ShoppingCart = ({ index, item }: CartItemProps) => {
    const removeItemFromCart = useSaleStore(state => state.removeItemFromCart)
    const setItemChangeQty = useSaleStore(state => state.setItemChangeQty)
   
    const setOpenCartSidebar = useStoreCartSidebar(state=>state.setOpenCartSidebar)
    const setDataItem = useStoreCartSidebar(state => state.setDataItem);
    const onClickShoppingCart = ()=>{ 
        setDataItem(item, index)
        setOpenCartSidebar(true)
    }
    return (
        <StyledCard onClick={onClickShoppingCart}>
            <Grid container   justifyContent="space-between">
                <Grid item  alignSelf="center">
                    <CardMedia
                        component="img"
                        sx={{
                            m: 1,
                            height: '80px',
                            width: '70px',
                            borderRadius: '5px',
                            flexShrink: 0,
                        }}
                        alt=""
                        image={item.s3ObjectUrl}
                    />
                </Grid>
                <Grid item xs={8} sm>
                    <StyledCardContent>
                        <StyledTypographyH4 variant="h4">
                            {item.description}
                        </StyledTypographyH4>
                        {
                            item.summary !== item.description && (
                                <StyledTypographyBody variant="body2" color="text.secondary">
                                    {item.summary}
                                </StyledTypographyBody>
                            )
                        }
                        <div
                            style={{
                                display: 'flex',
                                margin: '5px 0',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Stack direction="column"
                                justifyContent="center"
                                alignItems="flex-end">
                                <Typography variant="caption" color="text.primary">
                                    <b>P. U.:</b> ${RoundNumber(item.price, 2)}
                                </Typography>
                                {/* <Typography variant="caption" color="text.primary">
                                        <b>P. IVA.:</b> ${RoundNumber(item.priceWithVat, 2)}
                                    </Typography> */}
                                <Typography variant="caption" color="text.primary">
                                    <b>Total:</b> ${RoundNumber(item.total, 2)}
                                </Typography>
                            </Stack>
                            {/* <Typography variant="h5" component="div" sx={{ fontSize: '14px' }}>
                                $ 160
                            </Typography> */}
                            <StyledButtonMinus variant="contained" aria-label="Disminuir Cantidad" disabled={item.quantity === 1} onClick={(event) => {
                                event.stopPropagation();
                                const quantity = item.quantity - 1;
                                setItemChangeQty(index, quantity)
                            }}>-</StyledButtonMinus>
                            <Typography variant="h5" component="div">
                                {item.quantity}
                            </Typography>
                            <StyledButtonPlus variant="contained" aria-label="Aumentar Cantidad" onClick={(event) => {
                                event.stopPropagation();
                                const quantity = item.quantity + 1;
                                setItemChangeQty(index, quantity)
                            }}>+</StyledButtonPlus>
                        </div>
                    </StyledCardContent>
                </Grid>
                <Grid item>
                    <StyledIconButton aria-label="Quitar Item" onClick={(event) => {
                        event.stopPropagation();
                        removeItemFromCart(index)
                    }}>
                        <CloseIcon />
                    </StyledIconButton>
                </Grid>
            </Grid>
        </StyledCard>
    );
};

export default ShoppingCart;
