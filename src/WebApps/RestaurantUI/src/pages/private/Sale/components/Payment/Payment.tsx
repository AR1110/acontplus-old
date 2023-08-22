import { PaymentsIcon, SaveIcon, TaskIcon } from '@/core/components'
import Calculator from '@/core/components/Calculator/Calculator';
import HtmlTooltip from '@/core/components/HtmlTooltip';
import { useCheckoutStore, useSaleStore } from '@/stores'
import { Box, Button, Card, CardActions, CardContent, Divider, FormControl, Grid, InputLabel, OutlinedInput, Typography } from '@mui/material'
import { useState } from 'react';


export default function Payment() {
    const {voucher} = useCheckoutStore(state => state.checkout); 
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value.replace(/[^0-9.]/g, '');
         
    };

    return (
        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} sm={5} md={5}>
                <Calculator />
            </Grid>
            <Grid item xs={12} sm={7} md={7}>
                <Box sx={{ flexGrow: 1 }}>

                    <Card variant="outlined">
                        <CardContent>
                            <Grid item xs={12} sm container>
                                <Grid item xs container direction="column" spacing={2}>
                                    <Grid item xs>
                                        <Typography variant="h5" component="div">
                                            Total
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h5" component="div">
                                        ${voucher.payingAmount}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 5 }} />
                            <Grid item xs={12} sm container>
                                <Grid item xs>
                                    <FormControl fullWidth margin='normal'>
                                        <InputLabel htmlFor="cashValue">Efectivo</InputLabel>
                                        <OutlinedInput
                                            id="cashValue"
                                            value={voucher.receivedAmount}
                                            onChange={handleInputChange}
                                            startAdornment={<PaymentsIcon />}
                                            label="Cash Value"
                                            inputProps={{
                                                style: {
                                                    textAlign: 'right',
                                                    fontSize: 30,
                                                },
                                            }}
                                        />

                                    </FormControl>
                                </Grid>
                            </Grid>

                            {
                                voucher.changeReturn > 0 && (
                                    <Grid container alignItems="center">
                                        <Grid item xs>
                                            <Typography gutterBottom variant="h5" component="div">
                                                Cambio
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography gutterBottom variant="h5" component="div" color="error">
                                                $4.50
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                )
                            }
                        </CardContent>
                        <CardActions>
                            <Grid container spacing={2} columns={16}>
                                <Grid item xs={16} md={8} lg={8}>
                                    
                                </Grid>
                                <Grid item xs={16} md={8} lg={8}>
                                    {/* <HtmlTooltip
                                        title={
                                            <>
                                                <Typography variant="caption" display="block" gutterBottom>
                                                    {"Ya no será posible modificar la venta - para hacer cambios, tendrás que cancelar esta y crear una nueva."}
                                                </Typography>
                                            </>
                                        }
                                    >
                                    </HtmlTooltip> */}
                                    <Button variant='contained' color="success" startIcon={<SaveIcon />} size='large' fullWidth sx={{
                                        height: 80
                                    }}>
                                        Guardar
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardActions>
                    </Card>
                </Box>

            </Grid>
        </Grid>
    )
}
