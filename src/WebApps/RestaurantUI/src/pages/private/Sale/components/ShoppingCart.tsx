
import { styled, Card, CardContent, CardMedia, Typography, IconButton, Button, Grid, Stack, Box, InputBase } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RoundNumber } from '@/core/utilities';
import { ItemRead } from '@/core/models';
import { useSaleStore, useStoreCartSidebar } from '@/stores'; 
import { useState } from 'react';

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

    const setOpenCartSidebar = useStoreCartSidebar(state => state.setOpenCartSidebar)
    const setDataItem = useStoreCartSidebar(state => state.setDataItem);
    const setChangeValueOrderItem = useSaleStore(state => state.setChangeValueOrderItem);
    

    const onClickShoppingCart = (event: React.MouseEvent<HTMLElement>) => {

        if (!(event.target as HTMLElement).closest('#quantity')) {
            // Abre el modal o realiza otras acciones que desees
            setDataItem(item, index)
            setOpenCartSidebar(true)
        }
    }

    const handleFocus = (event: any) => {
        event.target.select(); // Seleccionar el texto
    };

    const handleBlur = () => { 
        console.log('_')
        // if(quantityItem!==item.quantity){
        //     setItemChangeQty(index, quantityItem);
        // } 
    };

    return (
        <StyledCard onClick={onClickShoppingCart}>
            <Grid container justifyContent="space-between">
                <Grid item alignSelf="center">
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

                        <Grid container>
                            <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
                                <Stack
                                    direction={{ xs: 'row', sm: 'row', md: 'row', lg: 'column' }}
                                    alignContent="center"
                                    justifyContent="center"
                                    spacing={{ xs: 1, sm: 1, md: 1 }}
                                >
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
                            </Grid>
                            <Grid item xl={4} lg={8} md={12} sm={12} xs={12}>
                                {/* Segunda columna para los botones y TextField */}
                                <Stack
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Box
                                        autoComplete='off'
                                        component="form"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyItems: "center",
                                            borderRadius: '0.2rem', // Bootstrap border-radius
                                        }}
                                    >
                                        <StyledButtonMinus
                                            id='buttonMinus'
                                            variant="contained"
                                            aria-label="Disminuir Cantidad"
                                            disabled={item.quantity === 1}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                const quantity = item.quantity - 1; 
                                                setItemChangeQty(index, quantity);
                                            }}
                                          
                                        >
                                            -
                                        </StyledButtonMinus>
                                        <InputBase id="quantity"
                                            sx={{
                                                ml: 1,
                                                flex: 1,
                                                fontSize: '1.2rem', // Bootstrap small font size
                                                height: 'calc(1.5em + 0.75rem + 2px)', // Bootstrap small input height
                                                border: 'none',
                                                outline: 'none',
                                                padding: '0.375rem 0.75rem', // Bootstrap small input padding
                                                '& input': {
                                                    textAlign: 'center', // Texto centrado
                                                },
                                            }}
                                            value={item.quantity}
                                            placeholder="0"
                                            inputProps={{
                                                'aria-label': '0',
                                                onFocus: handleFocus,
                                                onClick: handleFocus
                                            }}
                                            onChange={e=>{
                                                e.stopPropagation();
                                                let quantity = Number(e.target.value);
                                                if(quantity===0){
                                                    setTimeout(() => {
                                                        e.target.select();
                                                    }, 0);
                                                    quantity = 1; 
                                                    setChangeValueOrderItem(index, "quantity", quantity)
                                                } else if(quantity !==item.quantity){
                                                    setItemChangeQty(index, quantity);
                                                }
                                            }}
                                            onBlur={handleBlur}
                                        />
                                        <StyledButtonPlus
                                            variant="contained"
                                            aria-label="Aumentar Cantidad"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                const quantity = item.quantity + 1; 
                                                setItemChangeQty(index, quantity);
                                            }}
                                        >
                                            +
                                        </StyledButtonPlus>
                                    </Box>

                                    {/* <StyledButtonMinus
                                        variant="contained"
                                        aria-label="Disminuir Cantidad"
                                        disabled={item.quantity === 1}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            const quantity = item.quantity - 1;
                                            setItemChangeQty(index, quantity);
                                        }}
                                    >
                                        -
                                    </StyledButtonMinus>
                                    <TextField sx={{
                                        '& input': {
                                            fontSize: '20px',
                                            width: '30px',
                                            textAlign: 'center',
                                            border: '1px solid #ced4da',
                                            borderRadius: '0.2rem',
                                            height: '50%',
                                            padding: '0.375rem 0.75rem',
                                        },
                                    }}
                                        id="quantity" 
                                        onChange={(event) => {
                                            console.log(event.target.value);
                                        }}
                                    />
                                    <StyledButtonPlus
                                        variant="contained"
                                        aria-label="Aumentar Cantidad"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            const quantity = item.quantity + 1;
                                            setItemChangeQty(index, quantity);
                                        }}
                                    >
                                        +
                                    </StyledButtonPlus> */}
                                </Stack>
                            </Grid>
                        </Grid>

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
