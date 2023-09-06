import { useEffect, useState, useRef } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, Grid, InputLabel, OutlinedInput, Typography } from '@mui/material'
import { CalendarMonthIcon, PaymentsIcon, SaveIcon } from '@/core/components'
import Calculator from '@/core/components/Calculator/Calculator';
import { AccountReceivableService, SharedService } from '@/core/services';
import { CheckoutUtility, ErrorBoundary, Http, RoundNumber, SnackbarUtility } from '@/core/utilities';
import { useCheckoutStore, useLoaderStore, useSaleStore } from '@/stores'
import {
    paymentSubTypeAdapter,
    paymentTypeAdapter
} from '@/core/adapters';
import { ApiResponse, PaymentSubType, PaymentType, VoucherQuota } from '@/core/models'
import Swal from 'sweetalert2';
import { PATHS } from '@/core/constants';


export default function Checkout() {
    const NUM_MAX_ROUND = 5;
    const { showLoader } = useLoaderStore();
    const { queryParams } = useCheckoutStore(state => ({
        queryParams: state.queryParams
    }))

    const setVoucher = useCheckoutStore(state => state.setVoucher);
    const voucher = useCheckoutStore(state => state.checkout.voucher);
    const { setReceivedAmount, setChangeReturn } = useCheckoutStore(state => ({
        setReceivedAmount: state.setReceivedAmount,
        setChangeReturn: state.setChangeReturn,
    }))

    const [isReplaceReceivedAmount, setIsReplaceReceivedAmount] = useState(true);
    const [isOptionReceivedAmount, setIsOptionReceivedAmount] = useState(false);

    const {resetForm, payment} = useSaleStore(state => state); 

    const paymentTypes = useRef<Array<PaymentType>>([]);
    const paymentSubTypes = useRef<Array<PaymentSubType>>([]);
    const voucherQuotas = useRef<Array<VoucherQuota>>([])

    const onChangeReceivedAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value.replace(/[^0-9.]/g, '');
        const numeroStr = voucher.receivedAmount.toString();
        if (!inputValue) {
            setReceivedAmount('0')
            return
        }
        if (numeroStr === "0") {
            setReceivedAmount('')
        }
        setReceivedAmount(inputValue)
        setChangeReturn()
    };

    const handleClickOptionReceivedAmount = (inputValue: number) => {
        setReceivedAmount(inputValue.toString());
        setIsOptionReceivedAmount(true)
        setChangeReturn()
    }

    const handleChangeSetReceivedAmount = (value: number | string) => {
        const numeroStr = voucher.receivedAmount.toString();
        const valueCalculator = value.toString();
        if (numeroStr === "0" && (valueCalculator === "0")) return


        if (value === "." && numeroStr.split(".").length > 1) return

        if (numeroStr === "0" && valueCalculator === '.') {
            setReceivedAmount(numeroStr + valueCalculator);
            setChangeReturn()
            return
        }
        if (numeroStr === "0" || isOptionReceivedAmount) {
            setReceivedAmount(valueCalculator);
            setIsOptionReceivedAmount(false);
            setChangeReturn()
            return
        }
        if (isReplaceReceivedAmount) {
            setReceivedAmount(valueCalculator)
            setIsReplaceReceivedAmount(false);
            setChangeReturn()
            return
        }

        setReceivedAmount(numeroStr + valueCalculator)
        setChangeReturn()
    }

    const checkoutClearButton = () => {
        const numeroStr = voucher.receivedAmount.toString();
        let receivedAmount = "0";
        console.log(voucher.receivedAmount)
        if (voucher.receivedAmount === "0") {
            setReceivedAmount(receivedAmount);
            setChangeReturn()
            return
        }
        if (voucher.receivedAmount !== "0") {
            const nuevoNumeroStr = numeroStr.substring(0, numeroStr.length - 1); // Elimina los últimos "cantidad" dígitos
            receivedAmount = nuevoNumeroStr ? nuevoNumeroStr : '0';
        }
        setReceivedAmount(receivedAmount)
        setChangeReturn()
    }


    const initiload = async()=>{
        showLoader(true);
        await AccountReceivableService.get({
            tipo: 3,
            codEstab: queryParams.codEstab,
            idCuentaPorCobrar: queryParams.idCuentaPorCobrar,
            credito: queryParams.tiempoCredito
        }).then(response => {
            if (response.code === "1") {
                const mainData = JSON.parse(response.payload);
                const voucherQuotaRepository = mainData[5];
                const voucherRepository = mainData[6][0]; 
                paymentTypes.current = paymentTypeAdapter(mainData[0] ?? []);
                paymentSubTypes.current = paymentSubTypeAdapter(mainData[1] ?? []);
                setVoucher({
                    customerCompanyId: voucherRepository.idCliente,
                    customerIdentification: voucherRepository.numeroIdentificacion,
                    customerName: voucherRepository.nombreFiscal,
                    payingAmount: voucherRepository.importeTotal,
                    receivedAmount: voucherRepository.importeTotal,
                    changeReturn: 0,
                    totalBalance: voucherRepository.saldo,
                    codEstab: voucherRepository.codEstab,
                    creationDate: voucherRepository.fechaEmision,
                    nroDoc: voucherRepository.serieComprobante
                })
                voucherQuotas.current = voucherQuotaRepository.map((voucherItem: any) => ({
                    ...voucherItem,
                    cuotas: JSON.parse(voucherItem.cuotas),
                }))
            } else {
                SnackbarUtility.warning(response.message)
            }
        }).finally(() => showLoader(false))
    }

    useEffect(() => {
        initiload();
    }, [])

    const getValuePayment = () => {
        let valuePayment = 0;
        if (Number(voucher.receivedAmount) >= voucher.totalBalance) {
            valuePayment = RoundNumber(voucher.totalBalance, NUM_MAX_ROUND);
        } else {
            valuePayment = RoundNumber(Number(voucher.receivedAmount), NUM_MAX_ROUND)
        }
        return valuePayment;
    }


    const saveCheckout = async () => {
        try {
            if (!(Number(voucher.receivedAmount) > 0)) {
                SnackbarUtility.warning('Ingrese el valor de abono')
                return
            }
            if (paymentTypes.current.length === 0) {
                SnackbarUtility.warning('No tiene registrado Entidad Financiera')
                return
            }
            if (paymentSubTypes.current.length === 0) {
                SnackbarUtility.warning('No tiene registrado SubEntidad Financiera')
                return
            }
            const { isConfirmed } = await Swal.fire({
                // title: 'Guardar Cobro?',
                text: "Esta seguro de guardar el cobro?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!'
            })
            if (!isConfirmed) return

            const checkoutUtility = new CheckoutUtility();

            const comprobante = {
                idCliente: voucher.customerCompanyId,
                total: voucher.receivedAmount, //valor total ingresado 
                abono: getValuePayment(),
                codEstab: voucher.codEstab,
                numeroIdentificacion: voucher.customerIdentification,
                nombreFiscal: voucher.customerName
            }

            //  let infoCobro =  [{
            //      nro: $scope.cobro.nro,
            //      lote:$scope.cobro.lote,
            //      aprobacion: $scope.cobro.aprobacion,
            //      referencia: $scope.cobro.referencia
            //  }]
            const dataPaymentType = paymentTypes.current.find(pay => pay.code === "EFE")
            const dataPaymentSubType = paymentSubTypes.current.find(pay => pay.paymentTypeId === dataPaymentType?.paymentTypeId);

            const cobros = [{
                idEntidadFinanciera: dataPaymentType?.paymentTypeId,
                idSubEntidadFinanciera: dataPaymentSubType?.paymentSubtypeId,
                idBanco: 0,
                idCuentaBancaria: 0,
                fechaEmision: new Date(),
                valor: voucher.receivedAmount,
                posfechado: false,
                secuencial: 0,
                infoCobro: null,
                abono: getValuePayment(),
                controlCaja: dataPaymentSubType?.isControlBox
            }]

            checkoutUtility.setReceivedAmount(Number(voucher.receivedAmount))

            const modifiedQuotas = checkoutUtility.applyReceivedAmountToQuota(voucherQuotas.current);
            const historyPayments = checkoutUtility.getHistoryPayments(modifiedQuotas);

            if (checkoutUtility.paymentDetails.length === 0) {
                SnackbarUtility.warning('Cobro detalle vacio')
                return
            }

            const data = {
                comprobante,
                cobros,
                cobroDetalle: checkoutUtility.paymentDetails.filter(item => (item.abono > 0)),
                historial: historyPayments,
            }

            showLoader(true)
            await Http({
                method: 'post',
                url: `${PATHS.ACCOUNTING}ComprobanteIngreso/Insert`,
                data: {
                    data
                }
            }).then(resultAxios => {               
                const response: ApiResponse = resultAxios.data;
                if(response.code==="1"){
                    SnackbarUtility.success(response.message);
                    
                    if(queryParams.printerAutomatic){
                        SharedService.getPrinter(queryParams.orderId)  
                    }
                    resetForm();
                    payment.closeDialogCustom();                       
                }else{
                    SnackbarUtility.warning(response.message)
                } 
            }).finally(()=> showLoader(false))
            //  showLoader();
            //  cobroSvc.save(data).then(response=>{
            //      hideLoader();
            //      if(response.code==='0'){
            //          fS.sweetAlert('warning', response.message)
            //      }
            //      if(response.code==='1'){
            //          fS.sweetAlert('success', response.message, '', 1000)
            //          $uibModalInstance.close(response)
            //      }
            //  }).catch(error=>{
            //      hideLoader();
            //      console.log(error)
            //  })


        } catch (error) {
            console.log(error)
        }
    }
    return (
        <ErrorBoundary fallBackComponent={<>Error!</>}>
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={12} sm={5} md={5}>
                    <Calculator
                        clearButton={checkoutClearButton}
                        onClickButton={handleChangeSetReceivedAmount}
                        onClickOptionValue={handleClickOptionReceivedAmount}
                    />
                </Grid>
                <Grid item xs={12} sm={7} md={7}>
                    <Box sx={{ flexGrow: 1 }}>

                        <Card variant="outlined">
                            <CardHeader
                                title={`Nro. Doc: ${voucher.nroDoc}`}
                            />
                            <Divider />
                            <CardContent>
                                <Grid item xs={12} sm container>
                                    <Grid item xs container direction="column" spacing={2}>
                                        <Grid item xs>
                                            <Typography variant="h5" component="div">
                                                Total
                                            </Typography>
                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                {voucher.customerIdentification}
                                            </Typography>
                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                {voucher.customerName}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h5" component="div">
                                            ${voucher.payingAmount}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 2 }} />

                                {/* <Grid item xs={12} sm container>

                                    <Grid item xs>
                                        <FormControl fullWidth margin='normal'>
                                            <InputLabel htmlFor="dateValue">Fecha</InputLabel>
                                            <OutlinedInput inputRef={(input) => input?.focus()}
                                                id="dateValue"
                                                type='date'
                                                value={voucher.receivedAmount}
                                                startAdornment={<CalendarMonthIcon />}
                                                label="Date Value"
                                                inputProps={{
                                                    style: {
                                                        textAlign: 'right',
                                                        fontSize: 30,
                                                    },
                                                }}
                                            />

                                        </FormControl>
                                    </Grid>
                                </Grid> */}

                                <Grid item xs={12} sm container>

                                    <Grid item xs>
                                        <FormControl fullWidth margin='normal'>
                                            <InputLabel htmlFor="cashValue">Efectivo</InputLabel>
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

                </Grid>
            </Grid>
        </ErrorBoundary>
    )
}
