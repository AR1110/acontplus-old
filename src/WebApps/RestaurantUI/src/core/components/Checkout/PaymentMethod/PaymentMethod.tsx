import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, TextField, Typography } from '@mui/material'
import React from 'react'
import { PaymentsIcon, SaveIcon } from '../..'
import { useCheckoutStore } from '@/stores';

const PaymentMethod = () => {
    const voucher = useCheckoutStore(state => state.checkout.voucher);
    const dataForm = useCheckoutStore(state => state.checkout.dataForm);
    const onChangeReceivedAmount = () => {
        console.log('')
    }

    const saveCheckout = () => {
        console.log('kjdh')
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Card variant="outlined">
                <CardContent>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={1}>

                            <Typography variant="h5" component="div">
                                Total
                            </Typography>

                        </Grid>
                        <Grid item>
                            <Typography variant="h5" component="div">
                                ${voucher.payingAmount}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 1 }} />

                    <Grid item xs={12} sm container>
                        <Grid item xs={12}>
                            {
                                dataForm.paymentTypes.length > 0 && <TextField fullWidth
                                    id="idTipoIdentificacion"
                                    name="idTipoIdentificacion" 
                                    select                                   
                                >
                                    {
                                        dataForm.paymentTypes.map((item, index) => (
                                            <MenuItem value={item.paymentTypeId} key={index}>
                                                {item.description}
                                            </MenuItem>
                                        ))
                                    }


                                </TextField>
                            }

                        </Grid>
                        <Grid item xs>
                            <FormControl fullWidth margin='normal'>
                                <InputLabel htmlFor="cashValue">Valor Cobro</InputLabel>
                                <OutlinedInput inputRef={(input) => input?.focus()}
                                    id="cashValue"
                                    value={voucher.receivedAmount}
                                    onChange={onChangeReceivedAmount}

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
                                        ${voucher.changeReturn}
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
                            <Button variant='contained' color="success" startIcon={<SaveIcon fontSize="large" style={{
                                fontSize: 40
                            }} />} size='large' fullWidth sx={{
                                height: 80
                            }} onClick={saveCheckout}>
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Box>
    )
}

export default PaymentMethod