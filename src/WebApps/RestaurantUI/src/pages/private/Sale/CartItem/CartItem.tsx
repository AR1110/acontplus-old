
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ItemRead } from '@/core/models';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, IconButton, MenuItem, Stack, TextField } from '@mui/material';
import { AddIcon, DeleteIcon, RemoveCircleOutlineIcon } from '@/core/components/IconsMaterial';
import { useSaleStore } from '@/stores';


type CartItemProps = {
    index: number
    item: ItemRead
}


export default function CartItem({ index, item }: CartItemProps) {
    const removeItemFromCart = useSaleStore(state => state.removeItemFromCart)
    const setItemChangeQty = useSaleStore(state => state.setItemChangeQty)
    const setChangeValueOrderItem = useSaleStore(state => state.setChangeValueOrderItem);
    const onChangePVP = useSaleStore(state => state.onChangePVP)

    return (
        <>
            <Accordion>
                <AccordionSummary
                    aria-controls={`panel-content${index}`}
                    id={`expand${index}`}
                >
                    <Grid container spacing={2}>
                        <Grid item>
                            <Avatar
                                alt="Remy Sharp"
                                src={item.s3ObjectUrl}
                                sx={{ width: 56, height: 56 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={0}>
                                <Grid item xs>
                                    <Stack>
                                        <Typography variant="body2" gutterBottom>
                                            {item.description}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.code}
                                        </Typography>
                                    </Stack>
                                </Grid>

                            </Grid>
                            <Grid item width={95}>
                                <Stack direction="column"
                                    justifyContent="center"
                                    alignItems="flex-end">
                                    <Typography variant="caption" color="text.primary">
                                        <b>P. U.:</b> ${item.price}
                                    </Typography>
                                    <Typography variant="caption" color="text.primary">
                                        <b>P. IVA.:</b> ${item.priceWithVat}
                                    </Typography>
                                    <Typography variant="caption" color="text.primary">
                                        <b>Total:</b> ${item.total}
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs>
                                <Stack direction="row" alignItems="center">
                                    <IconButton aria-label="Disminuir Cantidad" disabled={item.quantity === 1} onClick={(event) => {
                                        event.stopPropagation();
                                        const quantity = item.quantity - 1;
                                        setItemChangeQty(index, quantity)
                                    }}>
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                    <Typography variant="h6" color="text.primary">
                                        {item.quantity}
                                    </Typography>
                                    <IconButton aria-label="Aumentar Cantidad" onClick={(event) => {
                                        event.stopPropagation();
                                        const quantity = item.quantity + 1;
                                        setItemChangeQty(index, quantity)
                                    }}>
                                        <AddIcon />
                                    </IconButton>
                                </Stack>
                            </Grid>
                            <Grid item xs>
                                <Stack direction="row"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                >
                                    <IconButton color='error' aria-label="Quitar Item" onClick={(event) => {
                                        event.stopPropagation();
                                        removeItemFromCart(index)
                                    }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>

                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                label="Comentario"
                                id="obs"
                                name="obs"
                                value={item.obs}
                                size="small"
                                multiline
                                fullWidth
                                onChange={(e) => {
                                    setChangeValueOrderItem(index, "obs", e.target.value)
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            {
                                item.pvps.length > 0 && (
                                    <TextField fullWidth
                                        size='small'
                                        id="pvps"
                                        name="pvps"
                                        value={item.feeId}
                                        label="Tarifa"
                                        select
                                        onChange={(e) => onChangePVP(Number(e.target.value), index)}
                                    >
                                        {
                                            item.pvps.map((pvp, index) => (
                                                <MenuItem value={pvp.feeId} key={index}>
                                                    {pvp.description} - ${pvp.priceWithVat}
                                                </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                )
                            }
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </>

    );
}
