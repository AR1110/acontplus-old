import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    FormControlLabel,
    Grid,
    InputAdornment,
    MenuItem,
    Switch,
    TextField,
    Typography
} from '@mui/material'
import IconButton from '@mui/material/IconButton';
import { ExpandMoreIcon, PaymentsIcon, SaveAltIcon, SaveIcon } from '../../IconsMaterial'
import { PaymentTypeCode } from '@/core/constants';
import City from './City';
import Bank from './Bank';
import PaymentSubType from './PaymentSubType';
import { useCheckoutContext } from '../context';
import { DatosCobro, InputReceivedAmount } from '.';

const PaymentMethod = () => {
    const { checkout, setChangePaymentType, onChangeReceivedAmount, save } = useCheckoutContext();
    const { voucher, dataForm, paymentData, paymentSubTypes } = checkout;

    //const onChangeReceivedAmount = useCheckoutStore(state => state.onChangeReceivedAmount)
    //const save = useCheckoutStore(state => state.save)
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
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={6}>

                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Button
                                variant='contained'
                                style={{ backgroundColor: '#28a745', color: '#fff' }} // Bootstrap success color
                                startIcon={<SaveIcon fontSize='large' style={{ fontSize: 30 }} />}
                                size='large'
                                fullWidth
                                sx={{
                                    height: 60,
                                }}
                                onClick={save}
                            >
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                    <Box component="form"
                        my={2}
                        sx={{
                            padding: '16px',
                            border: '1px solid #17a2b8',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',

                        }}
                        autoComplete="off">
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={12} lg={12}>
                                {
                                    paymentTypes.length > 0 && <TextField fullWidth
                                        id="paymentType"
                                        name="paymentType"
                                        label="Entidad Financiera"
                                        select

                                        value={paymentData.paymentTypeId}
                                        onChange={(e) => {
                                            const paymentTypeData = paymentTypes.find(item => item.paymentTypeId === Number(e.target.value));
                                            if (paymentTypeData) {
                                                const paymentSubTypeData = paymentTypeData.paymentSubTypes[0]
                                                setChangePaymentType({
                                                    paymentSubtypeId: paymentSubTypeData?.paymentSubtypeId ?? 0,
                                                    paymentTypeId: paymentTypeData?.paymentTypeId ?? 0,
                                                    paymentTypeCode: paymentTypeData?.code,
                                                    paymentTypeDescription: paymentTypeData?.description,
                                                    nro: "",
                                                    referencia: "",
                                                    aprobacion: "",
                                                    lote: "",
                                                    cityId: 0,
                                                    idBanco: 0
                                                }, paymentTypeData.paymentSubTypes)
                                            }
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
                            <Grid item xs={12} sm={6} md={6} lg={4}>
                                <PaymentSubType />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={8}>
                                <InputReceivedAmount />
                            </Grid>
                            {/* Other text field */}
                            {
                                paymentData.paymentTypeCode === PaymentTypeCode.TAR && (
                                    <>
                                        <Grid item xs={12} sm={6} md={6} lg={4}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Número"
                                                id="numero"
                                                name="numero"
                                                value={paymentData.nro}
                                                onChange={(e) => {
                                                    setChangePaymentType({
                                                        nro: e.target.value 
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Referencia"
                                                id="referencia"
                                                name="referencia"
                                                value={paymentData.referencia}
                                                onChange={(e) => {
                                                    setChangePaymentType({
                                                        referencia: e.target.value

                                                    })
                                                }}
                                            />
                                        </Grid>


                                        {/* second grid */}
                                        <Grid item xs={12} sm={6} md={6} lg={4}>
                                            <City />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Aprobación"
                                                id="aprobacion"
                                                name="aprobacion"
                                                value={paymentData.aprobacion}
                                                onChange={(e) => {
                                                    setChangePaymentType({
                                                        aprobacion: e.target.value

                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Lote"
                                                id="lote"
                                                name="lote"
                                                value={paymentData.lote}
                                                onChange={(e) => {
                                                    setChangePaymentType({
                                                        lote: e.target.value

                                                    })
                                                }}
                                            />
                                        </Grid>

                                    </>
                                )
                            }

                            {
                                paymentData.paymentTypeCode === PaymentTypeCode.TRA && (
                                    <>

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
                                                value={paymentData.nro}
                                                onChange={(e) => {
                                                    setChangePaymentType({
                                                        nro: e.target.value

                                                    })
                                                }}
                                            />
                                        </Grid>

                                    </>
                                )
                            }

                            {
                                paymentData.paymentTypeCode === PaymentTypeCode.CHE && (
                                    <>
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
                                                value={paymentData.nro}
                                                onChange={(e) => {
                                                    setChangePaymentType({
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
                                                value={paymentData.referencia}
                                                onChange={(e) => {
                                                    setChangePaymentType({
                                                        referencia: e.target.value

                                                    })
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <FormControlLabel label="Posfechado" control={
                                                <Switch aria-label='Posfechado' value={paymentData.posfechado} defaultChecked={false} />
                                            } />
                                        </Grid>
                                    </>
                                )
                            }
                            <Grid item xs={12} md={12}>
                                <Button
                                    variant='contained'

                                    size='large'
                                    fullWidth
                                    sx={{
                                        height: 60,
                                    }}
                                >
                                    Agregar cobro
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

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
                    {/* disabled={paymentData.paymentTypeCode === PaymentTypeCode.EFE} */}
                    <Box
                        sx={{
                            padding: '16px',
                            border: '1px solid #17a2b8',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }} >
                        <DatosCobro />
                    </Box>

                </CardContent>
                {/* <CardActions>
                    <Grid container spacing={2} columns={16}>
                        <Grid item xs={16} md={8} lg={8}>

                        </Grid>
                        <Grid item xs={16} md={8} lg={8}>
                            <Button variant='contained' color="success" startIcon={<SaveIcon fontSize="large" style={{
                                fontSize: 40
                            }} />} size='large' fullWidth sx={{
                                height: 80
                            }} onClick={() => save()}>
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions> */}
            </Card>
        </Box>
    )
}

export default PaymentMethod