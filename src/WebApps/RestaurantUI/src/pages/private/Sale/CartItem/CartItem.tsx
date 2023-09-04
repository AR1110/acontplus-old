import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Box, Button, ButtonGroup, Collapse, Grid, IconButton, TextField } from '@mui/material';
import { AddIcon, CommentIcon, DoDisturbOnTwoToneIcon, RemoveIcon } from '@/core/components';
import { useSaleStore } from '@/stores';
import { ItemRead } from '@/core/models';
import { useState } from 'react';


type CartItemProps = {
    index: number
    item: ItemRead
}


const CartItem = ({ index, item }: CartItemProps) => {
    const removeItemFromCart = useSaleStore(state => state.removeItemFromCart)
    const setAddQuantity = useSaleStore(state => state.setAddQuantity)
    const setRemoveQuantity = useSaleStore(state => state.setRemoveQuantity)
    const setChangeValueOrderItem = useSaleStore(state => state.setChangeValueOrderItem)

    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return (
        <>
            <ListItem alignItems="flex-start" secondaryAction={
                <IconButton aria-label="Quitar" onClick={() => removeItemFromCart(index)}>
                    <DoDisturbOnTwoToneIcon />
                </IconButton>
            }>
                <ListItemAvatar>
                    <Avatar alt={item.description} src={item.s3ObjectUrl} sx={{ width: 50, height: 50 }}>P</Avatar>
                </ListItemAvatar>
                <ListItemText sx={{
                    pl: 1
                }}
                    primary={item.description}
                    secondary={
                        <Box>
                            {/* <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            > 
                            </Typography> */}
                            {item.code}
                            {/* <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'left',
                                    '& > *': {
                                        m: 1,
                                    },
                                }}
                            >
                                <ButtonGroup aria-label="small button group">
                                    <Button color="error"  ><AddIcon /></Button>
                                    <Button>{item.quantity}</Button>
                                    <Button color="primary"><RemoveIcon /></Button>
                                </ButtonGroup>

                            </Box>   */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={8} md={8} >
                                    <ButtonGroup aria-label="small button group" size='small' color='inherit'>
                                        <Button onClick={handleExpandClick} >
                                            <CommentIcon />
                                        </Button>
                                        <Button disabled={item.quantity===1} onClick={()=>{
                                            const quantity = item.quantity  - 1;
                                            setRemoveQuantity(index, quantity)
                                        }}>
                                        <RemoveIcon   />
                                        </Button>
                                        <Button>{item.quantity}</Button>
                                        <Button onClick={()=>{
                                            const quantity = item.quantity  + 1;
                                            setRemoveQuantity(index, quantity)
                                        }}>
                                            <AddIcon  />
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} >
                                    <Typography variant="body2" color="text.primary">
                                        Precio: ${item.price.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" color="text.primary">
                                        Total: ${item.total}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    }
                />
            </ListItem>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 10, mb: 1 }}>
                    <TextField
                        label="Comentario"
                        id="obs"
                        size="small"
                        fullWidth
                        onBlur={(e) => {
                            setChangeValueOrderItem(index, "obs", e.target.value)
                        }}
                        value={item.obs}
                    />
                </Box>
            </Collapse>
            <Divider variant="inset" component="li" />
        </>
    );
}

export default CartItem;