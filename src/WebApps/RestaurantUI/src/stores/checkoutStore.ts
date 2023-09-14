
import { ApiResponse, Checkout, CheckoutDataForm, Payment, QueryParams, Voucher, checkoutInitialState, queryParamsInitialState } from "@/core/models"
import { create } from "zustand"
import { produce } from 'immer';
import { CheckoutUtility, Http, RoundNumber, SnackbarUtility } from "@/core/utilities";
import { PATHS, PaymentTypeCode } from "@/core/constants";
import Swal from "sweetalert2";
import { useLoaderStore } from ".";
import { SharedService } from "@/core/services";

type State = {
    queryParams: QueryParams
    checkout: Checkout
}

type Actions = {
    setCheckoutDataForm(data: CheckoutDataForm): void
    setQueryParams(data: QueryParams): void
    setVoucher(data: Voucher): void
    setPayment(data: Payment): void
    setChangeReturn(): void
    setReceivedAmount(value: string): void //Actualizar el abono  
    handleChangeSetReceivedAmount(value: number | string): void
    onChangeReceivedAmount(event: React.ChangeEvent<HTMLInputElement>): void
    getValuePayment(): number
    isValidData(): boolean | undefined
    save(closeDialog: () => void): void
}

type StateCalculator = {
    isOptionReceivedAmount: boolean
    isReplaceReceivedAmount: boolean
}

type ActionCalculator = {
    handleClickOptionReceivedAmount(value: number): void
    setIsOptionReceivedAmount(value: boolean): void
    setIsReplaceReceivedAmount(value: boolean): void
    checkoutClearButton(): void
}

export const useCheckoutStore = create<State & StateCalculator & Actions & ActionCalculator>((set, get) => ({
    isOpenDialog: false,
    queryParams: queryParamsInitialState,
    checkout: checkoutInitialState,
    isOptionReceivedAmount: false,
    isReplaceReceivedAmount: false,
    setCheckoutDataForm(data) {
        set(
            produce((state: State) => {
                const paymentData = data.paymentTypes.find(item => item.code === PaymentTypeCode.EFE);
                const paymentSubTypeData = data.paymentSubTypes.filter(item => item.paymentTypeId === paymentData?.paymentTypeId)[0];

                state.checkout.dataForm = data;
                state.checkout.payments.paymentTypeId = paymentData?.paymentTypeId ?? 0;
                state.checkout.payments.paymentSubtypeId = paymentSubTypeData?.paymentSubtypeId ?? 0;

                state.checkout.payments.paymentTypeCode = paymentData?.code
                state.checkout.payments.paymentTypeDescription = paymentData?.description;
                state.checkout.voucher = data.comprobante
            })
        )
    },
    setQueryParams(queryParams) {
        set(
            produce((state: State) => {
                state.queryParams = queryParams;
            })
        )
    },
    setVoucher(voucher) {
        set(
            produce((state: State) => {
                state.checkout.voucher = voucher;
            })
        )
    },
    setPayment(payments) {
        set(
            produce((state: State) => {
                state.checkout.payments = payments;

            })
        )
    },
    setChangeReturn() {
        const { payingAmount, receivedAmount } = get().checkout.voucher;
        let changeReturn = 0;
        const receivedAmountValue = parseFloat(receivedAmount)
        if (receivedAmountValue > payingAmount) {
            changeReturn = receivedAmountValue - payingAmount;
        }

        set(
            produce((state: State) => {
                state.checkout.voucher.changeReturn = RoundNumber(changeReturn, 2)
            })
        )
    },
    setReceivedAmount(receivedAmount) {
        set(
            produce((state: State) => {
                state.checkout.voucher.receivedAmount = receivedAmount;
            })
        )
    },
    handleChangeSetReceivedAmount(value) {
        const { voucher } = get().checkout;
        const { setReceivedAmount, setChangeReturn } = get();
        const { isOptionReceivedAmount, setIsOptionReceivedAmount } = get();
        const { isReplaceReceivedAmount, setIsReplaceReceivedAmount } = get();

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
    },
    setIsOptionReceivedAmount(value) {
        set({
            isOptionReceivedAmount: value
        })
    },
    setIsReplaceReceivedAmount(value) {
        set({
            isReplaceReceivedAmount: value
        })
    },
    handleClickOptionReceivedAmount(value) {
        const { setReceivedAmount, setIsOptionReceivedAmount, setChangeReturn } = get();
        setReceivedAmount(value.toString());
        setIsOptionReceivedAmount(true)
        setChangeReturn()
    },
    checkoutClearButton() {
        const { voucher } = get().checkout;
        const { setReceivedAmount, setChangeReturn } = get();

        const numeroStr = voucher.receivedAmount.toString();
        let receivedAmount = "0";

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
    },
    onChangeReceivedAmount(event) {
        const { voucher } = get().checkout;
        const { setReceivedAmount, setChangeReturn } = get();
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
    },
    getValuePayment() {
        let valuePayment = 0;
        const NUM_MAX_ROUND = 5;
        const { voucher } = get().checkout;
        if (Number(voucher.receivedAmount) >= voucher.totalBalance) {
            valuePayment = RoundNumber(voucher.totalBalance, NUM_MAX_ROUND);
        } else {
            valuePayment = RoundNumber(Number(voucher.receivedAmount), NUM_MAX_ROUND)
        }
        return valuePayment;
    },
    isValidData() {
        const { payments } = get().checkout;
        if (!(payments.paymentSubtypeId > 0)) {
            SnackbarUtility.warning('Seleccione la SubEntidad Financiera')
        }

        // if(!cobro.fechaEmision){
        //     this.tS.toastr('warning', 'Ingrese la fecha de emisión')
        //     return
        // }
        // if(!this.isDateValid(cobro.fechaEmision)){
        //     this.tS.toastr('warning', 'Ingrese una fecha válida')
        //     return
        // } 

        // if (!(voucher.receivedAmount > 0)) {
        //     SnackbarUtility.warning('Ingrese el valor de abono')
        //     return
        // }

        // =================== TARJETA DE CREDITO / DEBITO  =================================== //
        if (payments.paymentTypeCode === PaymentTypeCode.TAR) {
            if (!payments.nro) {
                SnackbarUtility.warning('Ingrese el Número')
                return
            }

            if (!(payments.cityId && payments.cityId > 0)) {
                SnackbarUtility.warning('Ingrese la Ciudad')
                return
            }
            if (!payments.referencia) {
                SnackbarUtility.warning('Ingrese la referencia')
                return
            }
            if (!payments.aprobacion) {
                SnackbarUtility.warning('Ingrese la Aprobación')
                return
            }
            if (!payments.lote) {
                SnackbarUtility.warning('Ingrese el Lote')
                return
            }
        }

        // =================== TRANSFERENCIAS  =================================== //

        if (payments.paymentTypeCode === PaymentTypeCode.TRA) {
            if (!(payments.idBanco && payments.idBanco > 0)) {
                SnackbarUtility.warning('Seleccione el Banco')
                return
            }
            if (!payments.nro) {
                SnackbarUtility.warning('Ingrese el Número')
                return
            }
        }

        // =================== CHEQUES  =================================== //

        if (payments.paymentTypeCode === PaymentTypeCode.CHE) {
            if (!(payments.idBanco && payments.idBanco > 0)) {
                SnackbarUtility.warning('Seleccione el Banco')
                return
            }
            if (!payments.nro) {
                SnackbarUtility.warning('Ingrese el Número')
                return
            }

            if (!(payments.cityId && payments.cityId > 0)) {
                SnackbarUtility.warning('Ingrese la Ciudad')
                return
            }
            if (!payments.referencia) {
                SnackbarUtility.warning('Ingrese a quien va dirigido el Cheque')
                return
            }
        }

        return true;
    },
    async save(closeDialog) {
        const { getValuePayment, queryParams, isValidData } = get();
        const { voucher, dataForm, payments } = get().checkout;
        const { paymentSubTypes, voucherQuotas } = dataForm;
        const showLoader = useLoaderStore.getState().showLoader;
        try {
            if (!(Number(voucher.payingAmount) > 0)) {
                SnackbarUtility.warning('El valor total del comprobante es 0; por lo tanto, no es posible realizar el cobro.')
                return
            }
            if (!(Number(voucher.receivedAmount) > 0)) {
                SnackbarUtility.warning('Ingrese el valor de abono')
                return
            }
            if (!(Number(voucher.payingAmount) > 0)) {
                SnackbarUtility.warning('El valor total del comprobante es 0; por lo tanto, no es posible realizar el cobro.')
                return
            }
            if(!isValidData())  throw "Form Invalid";

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

            const infoCobro = [{
                nro: payments.nro,
                lote: payments.lote,
                aprobacion: payments.aprobacion,
                referencia: payments.referencia,
                idCiudad: payments.cityId
            }]
            const dataPaymentSubType = paymentSubTypes.find(item => item.paymentSubtypeId === payments.paymentSubtypeId)

            const cobros = [{
                idEntidadFinanciera: payments.paymentTypeId,
                idSubEntidadFinanciera: payments.paymentSubtypeId,
                idBanco: payments.idBanco,
                idCuentaBancaria: 0,
                fechaEmision: new Date(),
                valor: voucher.receivedAmount,
                posfechado: payments.posfechado,
                secuencial: 0,
                infoCobro: payments.paymentTypeCode === PaymentTypeCode.EFE ? undefined : JSON.stringify(infoCobro),
                abono: getValuePayment(),
                controlCaja: dataPaymentSubType?.isControlBox 
            }]

            checkoutUtility.setReceivedAmount(Number(voucher.receivedAmount))

            const modifiedQuotas = checkoutUtility.applyReceivedAmountToQuota(voucherQuotas);
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
                if (response.code === "1") {
                    SnackbarUtility.success(response.message);

                    if (queryParams.printerAutomatic) {
                        SharedService.getPrinter(queryParams.orderId)
                    }

                    closeDialog();
                } else {
                    SnackbarUtility.warning(response.message)
                }
            }).finally(() => showLoader(false))


        } catch (error) {
            console.log(error)
        }
    },
}))