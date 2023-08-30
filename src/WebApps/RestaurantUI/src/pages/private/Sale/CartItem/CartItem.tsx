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

export default function AlignItemsList({ item }: { item: any }) {
    const removeItemFromCart = useSaleStore(state => state.removeItemFromCart)
    const setItemChangeQty = useSaleStore(state => state.setItemChangeQty)

    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return (
        <>
            <ListItem alignItems="flex-start" secondaryAction={
                <IconButton aria-label="Quitar" onClick={() => removeItemFromCart(item.productId)}>
                    <DoDisturbOnTwoToneIcon />
                </IconButton>
            }>
                <ListItemAvatar>
                    <Avatar alt={item.descripcion} src={item.s3ObjectUrl} sx={{ width: 56, height: 56 }}>P</Avatar>
                </ListItemAvatar>
                <ListItemText sx={{
                    pl: 1
                }}
                    primary={item.description}
                    secondary={
                        <React.Fragment>
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
                                    <ButtonGroup aria-label="small button group" color='inherit'>
                                        <Button onClick={handleExpandClick} >
                                            <CommentIcon />
                                        </Button>
                                        <Button><AddIcon color='error' /></Button>
                                        <Button>{item.quantity}</Button>
                                        <Button ><RemoveIcon color='success' /></Button>
                                    </ButtonGroup>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} >
                                    <Typography variant="body2" color="text.primary">
                                        <strong>Precio:</strong> ${item.price.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" color="text.primary">
                                        <strong>Total:</strong> ${item.total}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 10, mb: 1 }}>
                    <TextField
                        label="Comentario"
                        id="comentario"
                        size="small"
                        fullWidth
                        value={item.obs}
                    />
                </Box>
            </Collapse>
            <Divider variant="inset" component="li" />
        </>
    );
}