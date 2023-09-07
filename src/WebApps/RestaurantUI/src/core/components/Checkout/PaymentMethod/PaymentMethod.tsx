import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, OutlinedInput, Switch, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { ExpandMoreIcon, PaymentsIcon, SaveIcon } from '../..'
import { useCheckoutStore } from '@/stores';
import { PaymentTypeCode } from '@/core/constants';

const PaymentMethod = () => {
    const voucher = useCheckoutStore(state => state.checkout.voucher);
    const dataForm = useCheckoutStore(state => state.checkout.dataForm);
    const payments = useCheckoutStore(state => state.checkout.payments);
    const setPayment = useCheckoutStore(state => state.setPayment);

    const paymentTypes = dataForm.paymentTypes;
    const paymentSubTypes = dataForm.paymentSubTypes.filter(item => item.paymentTypeId === payments.paymentTypeId)

    console.log(paymentSubTypes, payments.paymentTypeId)

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
                                paymentTypes.length > 0 && <TextField fullWidth
                                    id="paymentType"
                                    name="paymentType"

                                    select
                                    value={payments.paymentTypeId}
                                    onChange={(e) => {
                                        const paymentData = paymentTypes.find(item => item.paymentTypeId === Number(e.target.value));
                                        const paymentSubTypeData = dataForm.paymentSubTypes.filter(item => item.paymentTypeId === Number(e.target.value))[0];
                                        setPayment({
                                            ...payments,
                                            paymentSubtypeId: paymentSubTypeData?.paymentSubtypeId ?? 0,
                                            paymentTypeId: paymentData?.paymentTypeId ?? 0,
                                            paymentTypeCode: paymentData?.code,
                                            paymentTypeDescription: paymentData?.description,


                                        })
                                        console.log(e.target.value)
                                    }}
                                >
                                    {
                                        paymentTypes.map((item, index) => (
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
                                <OutlinedInput
                                    id="cashValue"
                                    name='cashValue'
                                    value={voucher.receivedAmount}
                                    // onChange={onChangeReceivedAmount}

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

                    <Accordion disabled={payments.paymentTypeCode===PaymentTypeCode.EFE}>
                        <AccordionSummary  
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>{payments.paymentTypeDescription}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {
                                payments.paymentTypeCode === PaymentTypeCode.TAR && (
                                    <>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={4}>
                                                    {paymentSubTypes.length > 0 && <TextField fullWidth
                                                        id="paymentType"
                                                        name="paymentType"

                                                        select
                                                        value={payments.paymentSubtypeId}
                                                        onChange={(e) => {
                                                            const paymentData = paymentSubTypes.find(item => item.paymentSubtypeId === Number(e.target.value));
                                                            setPayment({
                                                                ...payments,
                                                                paymentSubtypeId: paymentData?.paymentSubtypeId ?? 0,

                                                            })
                                                            console.log(e.target.value)
                                                        }}
                                                    >
                                                        {
                                                            paymentSubTypes.map((item, index) => (
                                                                <MenuItem value={item.paymentSubtypeId} key={index}>
                                                                    {item.description}
                                                                </MenuItem>
                                                            ))
                                                        }


                                                    </TextField>
                                                    }
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        label="Número"
                                                        id="numero"
                                                        name="numero"
                                                        value={payments.nro}
                                                        onChange={(e) => {
                                                            setPayment({
                                                                ...payments,
                                                                nro: e.target.value

                                                            })
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        label="Referencia"
                                                        id="referencia"
                                                        name="referencia"
                                                        value={payments.referencia}
                                                        onChange={(e) => {
                                                            setPayment({
                                                                ...payments,
                                                                referencia: e.target.value

                                                            })
                                                        }}
                                                    />
                                                </Grid>


                                                {/* second grid */}
                                                <Grid item xs={4}>
                                                    {dataForm.cities.length > 0 && <TextField fullWidth
                                                        id="city"
                                                        name="city"
                                                        select
                                                        value={payments.cityId}
                                                        onChange={(e) => {
                                                            setPayment({
                                                                ...payments,
                                                                cityId: Number(e.target.value)

                                                            })
                                                            console.log(e.target.value)
                                                        }}
                                                    >
                                                        {
                                                            dataForm.cities.map((item, index) => (
                                                                <MenuItem value={item.cityId} key={index}>
                                                                    {item.description}
                                                                </MenuItem>
                                                            ))
                                                        }


                                                    </TextField>
                                                    }
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        label="Aprobación"
                                                        id="aprobacion"
                                                        name="aprobacion"
                                                        value={payments.aprobacion}
                                                        onChange={(e) => {
                                                            setPayment({
                                                                ...payments,
                                                                aprobacion: e.target.value

                                                            })
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        label="Lote"
                                                        id="lote"
                                                        name="lote"
                                                        value={payments.lote}
                                                        onChange={(e) => {
                                                            setPayment({
                                                                ...payments,
                                                                lote: e.target.value

                                                            })
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </>
                                )
                            }

                            {
                                payments.paymentTypeCode === PaymentTypeCode.TRA && (
                                    <>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    {paymentSubTypes.length > 0 && <TextField fullWidth
                                                        id="paymentType"
                                                        name="paymentType"

                                                        select
                                                        value={payments.paymentSubtypeId}
                                                        onChange={(e) => {
                                                            const paymentData = paymentSubTypes.find(item => item.paymentSubtypeId === Number(e.target.value));
                                                            setPayment({
                                                                ...payments,
                                                                paymentSubtypeId: paymentData?.paymentSubtypeId ?? 0,

                                                            })
                                                            console.log(e.target.value)
                                                        }}
                                                    >
                                                        {
                                                            paymentSubTypes.map((item, index) => (
                                                                <MenuItem value={item.paymentSubtypeId} key={index}>
                                                                    {item.description}
                                                                </MenuItem>
                                                            ))
                                                        }


                                                    </TextField>
                                                    }
                                                </Grid>
                                                <Grid item xs={6}>
                                                    {dataForm.banks.length > 0 && <TextField fullWidth
                                                        id="bank"
                                                        name="bank"
                                                        select
                                                        value={payments.idBanco}
                                                        onChange={(e) => {
                                                            setPayment({
                                                                ...payments,
                                                                idBanco: Number(e.target.value),
                                                            })
                                                        }}
                                                    >
                                                        {
                                                            dataForm.banks.map((item, index) => (
                                                                <MenuItem value={item.bankId} key={index}>
                                                                    {item.description}
                                                                </MenuItem>
                                                            ))
                                                        }


                                                    </TextField>
                                                    }
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        label="Número"
                                                        id="numero"
                                                        name="numero"
                                                        value={payments.nro}
                                                        onChange={(e) => {
                                                            setPayment({
                                                                ...payments,
                                                                nro: e.target.value

                                                            })
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </>
                                )
                            }

                            {
                                payments.paymentTypeCode === PaymentTypeCode.CHE && (
                                    <>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={6}>
                                                    {paymentSubTypes.length > 0 && <TextField fullWidth
                                                        id="paymentType"
                                                        name="paymentType"

                                                        select
                                                        value={payments.paymentSubtypeId}
                                                        onChange={(e) => {
                                                            const paymentData = paymentSubTypes.find(item => item.paymentSubtypeId === Number(e.target.value));
                                                            setPayment({
                                                                ...payments,
                                                                paymentSubtypeId: paymentData?.paymentSubtypeId ?? 0,

                                                            })
                                                            console.log(e.target.value)
                                                        }}
                                                    >
                                                        {
                                                            paymentSubTypes.map((item, index) => (
                                                                <MenuItem value={item.paymentSubtypeId} key={index}>
                                                                    {item.description}
                                                                </MenuItem>
                                                            ))
                                                        }


                                                    </TextField>
                                                    }
                                                </Grid>
                                                <Grid item xs={6}>
                                                    {dataForm.banks.length > 0 && <TextField fullWidth
                                                        id="bank"
                                                        name="bank"
                                                        select
                                                        value={payments.idBanco}
                                                        onChange={(e) => {
                                                            setPayment({
                                                                ...payments,
                                                                idBanco: Number(e.target.value),
                                                            })
                                                        }}
                                                    >
                                                        {
                                                            dataForm.banks.map((item, index) => (
                                                                <MenuItem value={item.bankId} key={index}>
                                                                    {item.description}
                                                                </MenuItem>
                                                            ))
                                                        }


                                                    </TextField>
                                                    }
                                                </Grid>

                                                <Grid item xs={6}>
                                                    {dataForm.cities.length > 0 && <TextField fullWidth
                                                        id="city"
                                                        name="city"
                                                        select
                                                        value={payments.cityId}
                                                        onChange={(e) => {
                                                            setPayment({
                                                                ...payments,
                                                                cityId: Number(e.target.value)

                                                            })
                                                            console.log(e.target.value)
                                                        }}
                                                    >
                                                        {
                                                            dataForm.cities.map((item, index) => (
                                                                <MenuItem value={item.cityId} key={index}>
                                                                    {item.description}
                                                                </MenuItem>
                                                            ))
                                                        }


                                                    </TextField>
                                                    }
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        label="Número"
                                                        id="numero"
                                                        name="numero"
                                                        value={payments.nro}
                                                        onChange={(e) => {
                                                            setPayment({
                                                                ...payments,
                                                                nro: e.target.value

                                                            })
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        label="Referencia"
                                                        id="referencia"
                                                        name="referencia"
                                                        value={payments.referencia}
                                                        onChange={(e) => {
                                                            setPayment({
                                                                ...payments,
                                                                referencia: e.target.value

                                                            })
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <FormControlLabel label="Posfechado" control={
                                                        <Switch aria-label='Posfechado' />
                                                    } />
                                                </Grid>



                                            </Grid>
                                        </Box>
                                    </>
                                )
                            }
                        </AccordionDetails>
                    </Accordion>

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