
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ItemRead } from '@/core/models';
import { Avatar, Collapse, IconButton, IconButtonProps, TextField } from '@mui/material';
import { red } from '@mui/material/colors';
import { AddIcon, DeleteIcon, ExpandMoreIcon, RemoveCircleOutlineIcon } from '@/core/components';
import { useSaleStore } from '@/stores';
import { useState } from 'react';

const Img = styled('div')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

type CartItemProps = {
    index: number
    item: ItemRead
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function CartItem({ index, item }: CartItemProps) {
    const removeItemFromCart = useSaleStore(state => state.removeItemFromCart)
    const setRemoveQuantity = useSaleStore(state => state.setRemoveQuantity)
    const setChangeValueOrderItem = useSaleStore(state => state.setChangeValueOrderItem)
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };



    return (
        <Paper
            sx={{
                p: 2,
                margin: 'auto',
                maxWidth: 500,
                flexGrow: 1,
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
            }}
        >
            <Grid container spacing={1}>
                <Grid item>
                    <Img>
                        <Avatar src={item.s3ObjectUrl}
                            sx={{ width: 56, height: 56, bgcolor: red[500] }}
                            aria-label="recipe" variant='rounded'>
                            R
                        </Avatar>
                    </Img>
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={1}>
                        <Grid item xs>
                            <Typography variant="body2" gutterBottom>
                                {item.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {item.code}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" color="text.primary">
                            <b>Precio:</b> ${item.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                            <b>Cant.:</b> ${item.quantity.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                            <b>Total:</b> ${item.total}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
            >
                <Grid item xs container direction="row" alignItems="center" spacing={1}>
                    <IconButton aria-label="Disminuir Cantidad" disabled={item.quantity === 1} onClick={() => {
                        const quantity = item.quantity - 1;
                        setRemoveQuantity(index, quantity)
                    }}>
                        <RemoveCircleOutlineIcon />
                    </IconButton>
                    <Typography variant="h6" color="text.primary">
                        {item.quantity}
                    </Typography>
                    <IconButton aria-label="Aumentar Cantidad" onClick={() => {
                        const quantity = item.quantity + 1;
                        setRemoveQuantity(index, quantity)
                    }}>
                        <AddIcon />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton color='error' aria-label="Quitar Item" onClick={() => removeItemFromCart(index)}>
                        <DeleteIcon />
                    </IconButton>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </Grid>

            </Grid>
            <Collapse in={expanded} timeout="auto" unmountOnExit>

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

            </Collapse>
        </Paper>
    );
}
