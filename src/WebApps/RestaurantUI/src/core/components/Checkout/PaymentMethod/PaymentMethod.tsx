import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardActions, CardContent, Divider, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Switch, TextField, Typography } from '@mui/material'
import { ExpandMoreIcon, PaymentsIcon, SaveIcon } from '../..'
import { useCheckoutStore } from '@/stores';
import { PaymentTypeCode } from '@/core/constants';
import City from './City';
import Bank from './Bank';
import PaymentSubType from './PaymentSubType';

type PaymentMethodProps = {
    closeDialog():void
}
const PaymentMethod = ({closeDialog}:PaymentMethodProps) => {
    const voucher = useCheckoutStore(state => state.checkout.voucher);
    const dataForm = useCheckoutStore(state => state.checkout.dataForm);
    const payments = useCheckoutStore(state => state.checkout.payments);
    const setPayment = useCheckoutStore(state => state.setPayment);
    const onChangeReceivedAmount = useCheckoutStore(state => state.onChangeReceivedAmount)
    const save = useCheckoutStore(state => state.save)
    const paymentTypes = dataForm.paymentTypes;


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
                                            nro: "",
                                            referencia: "",
                                            aprobacion: "",
                                            lote: "",
                                            cityId: 0,
                                            idBanco: 0


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
                            <TextField
                                fullWidth
                                margin='normal'
                                id="cashValue"
                                name='cashValue'
                                label="Valor Cobro"
                                value={voucher.receivedAmount}
                                onChange={onChangeReceivedAmount}

                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        <PaymentsIcon />
                                    </InputAdornment>,
                                }}
                                inputProps={{
                                    style: {
                                        textAlign: 'right',
                                        fontSize: 30,
                                    },
                                }}
                            />
                            {/* <FormControl fullWidth margin='normal'>
                                <InputLabel htmlFor="cashValue">Valor Cobro</InputLabel>
                                <OutlinedInput
                                    id="cashValue"
                                    name='cashValue'
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

                            </FormControl> */}
                        </Grid>
                    </Grid>

                    {
                        voucher.changeReturn > 0 && (
                            <Grid container alignItems="center">
                                <Grid item xs>
                                    <Typography gutterBottom variant="h4" component="div">
                                        Cambio
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography gutterBottom variant="h4" component="div" color="error">
                                        ${voucher.changeReturn}
                                    </Typography>
                                </Grid>
                            </Grid>
                        )
                    }

                    <Accordion disabled={payments.paymentTypeCode === PaymentTypeCode.EFE}>
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
                                                <Grid item xs={12} sm={4}>
                                                    <PaymentSubType />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
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
                                                <Grid item xs={12} sm={4}>
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
                                                <Grid item xs={12} sm={4}>
                                                    <City />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
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
                                                <Grid item xs={12} sm={4}>
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
                                                    <PaymentSubType />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Bank />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
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
                                                <Grid item xs={12} sm={6}>
                                                    <PaymentSubType />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Bank />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <City />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
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

                                                <Grid item xs={12} sm={6}>
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

                                                <Grid item xs={12} sm={6}>
                                                    <FormControlLabel label="Posfechado" control={
                                                        <Switch aria-label='Posfechado' value={payments.posfechado} defaultChecked={false} />
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
                            }} onClick={()=>save(closeDialog)}>
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