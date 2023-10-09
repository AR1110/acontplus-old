import { createContext, useContext, useReducer } from "react";
import axios, { CancelTokenSource } from "axios";
import { CheckoutState, CheckoutActions, initialCheckoutState, Payment, CheckoutParams } from "@/core/models";
import { GET_CHECKOUT_BEGIN, GET_CHECKOUT_ERROR, GET_CHECKOUT_SUCCESS, SET_CHANGE_RETURN, SET_OPTION_RECEIVED_AMOUNT, SET_PAYMENT_DATA, SET_RECEIVE_AMOUNT, SET_REPLACE_RECEIVED_AMOUNT, checkoutReducer } from ".";
import { SharedService, accountReceivableService as accountReceivableSvc } from "@/core/services";
import { CheckoutUtility, RoundNumber, SnackbarUtility } from "@/core/utilities";
import { PaymentTypeCode } from "@/core/constants"; 
import Swal from "sweetalert2";
import { showLoader, hideLoader } from "@/spinner";
const initialCheckoutParams: CheckoutParams = {
    orderId: 0,
    idDocumento: 0,
    idTipoDocumento: 0,
    codEstab: "",
    tiempoCredito: 0,
    idCliente: 0,
    codDoc: "NE",
    idCuentaPorCobrar: 0,
    payAutomatic: false,
    printerAutomatic: false
}

const initialState: CheckoutState = {
    isOptionReceivedAmount: false,
    isReplaceReceivedAmount: true,
    checkoutParams: structuredClone(initialCheckoutParams),
    checkoutLoading: false,
    checkoutError: false,
    checkout: structuredClone(initialCheckoutState),
    closeDialog: () => []
}
const initialActions: CheckoutActions = {
    fetchCheckout: () => [],
    setPayment: () => [],
    onChangeReceivedAmount: () => [],
    handleChangeSetReceivedAmount: () => [],
    handleClickOptionReceivedAmount: () => [],
    checkoutClearButton: () => [],
    save: () => []
}

export const CheckoutContext = createContext<CheckoutState & CheckoutActions>({
    ...initialState,
    ...initialActions
})


interface Props {
    children: JSX.Element | JSX.Element[]
}
export const CheckoutProvider = ({ children }: Props) => {
    // Utiliza useReducer para gestionar el estado
    const [state, dispatch] = useReducer(checkoutReducer, initialState);

    let cancelTokenSource: CancelTokenSource | null = null;

    // Función para cargar datos de pedido
    /**
     * 
     * @param params 
     * @param callback para cerrar modal combro  
     */
    const fetchCheckout = async <T extends CheckoutParams>(params: T, callback: () => void) => {
        console.log(params)
        try {
            const { codEstab, idCuentaPorCobrar, tiempoCredito } = params;
            // Inicia el indicador de carga
            dispatch({ type: GET_CHECKOUT_BEGIN })
            // Check if we made a request
            if (cancelTokenSource) {
                // Cancel the previous request before making a new request
                cancelTokenSource.cancel('Request canceled');
            }
            // Create a new CancelTokenSource
            cancelTokenSource = axios.CancelToken.source();
            const response = await accountReceivableSvc.get({
                tipo: 3,
                codEstab: codEstab,
                idCuentaPorCobrar: idCuentaPorCobrar,
                credito: tiempoCredito
            })
            dispatch({
                type: GET_CHECKOUT_SUCCESS,
                payload: {
                    data: response,
                    checkoutParams: params,
                    closeDialog: callback
                }
            });
        } catch (error) {
            dispatch({ type: GET_CHECKOUT_ERROR })
        }
    }

    const setPayment = <T extends Payment>(payload: Partial<T>) => {
        console.log(payload)
        dispatch({ type: SET_PAYMENT_DATA, payload });
    }

    const setReceivedAmount = (payload: string) => {
        dispatch({ type: SET_RECEIVE_AMOUNT, payload });
    }

    const setChangeReturn = () => {
        dispatch({ type: SET_CHANGE_RETURN });
    }

    const onChangeReceivedAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { voucher } = state.checkout;
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
    }

    const handleChangeSetReceivedAmount = (value: number | string) => {
        const { voucher } = state.checkout;

        const numeroStr = voucher.receivedAmount.toString();
        const valueCalculator = value.toString();
        if (numeroStr === "0" && (valueCalculator === "0")) return


        if (value === "." && numeroStr.split(".").length > 1) return

        if (numeroStr === "0" && valueCalculator === '.') {
            setReceivedAmount(numeroStr + valueCalculator);
            setChangeReturn()
            return
        }
        if (numeroStr === "0" || state.isOptionReceivedAmount) {
            setReceivedAmount(valueCalculator);
            setIsOptionReceivedAmount(false);
            setChangeReturn()
            return
        }
        if (state.isReplaceReceivedAmount) {
            setReceivedAmount(valueCalculator)
            setIsReplaceReceivedAmount(false);
            setChangeReturn()
            return
        }

        setReceivedAmount(numeroStr + valueCalculator)
        setChangeReturn()
    }

    const setIsOptionReceivedAmount = (payload: boolean) => {
        dispatch({
            type: SET_OPTION_RECEIVED_AMOUNT,
            payload
        })
    }
    const setIsReplaceReceivedAmount = (payload: boolean) => {
        dispatch({
            type: SET_REPLACE_RECEIVED_AMOUNT,
            payload
        })
    }

    const handleClickOptionReceivedAmount = (value: number) => {
        setReceivedAmount(value.toString());
        setIsOptionReceivedAmount(true)
        setChangeReturn()
    }
    const checkoutClearButton = () => {
        try {
            const { voucher } = state.checkout;

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
        } catch (error) {
            console.log(error)
        }
    }

    const isValidData = () => {
        const { payments } = state.checkout;
        if (!(payments.paymentSubtypeId > 0)) {
            SnackbarUtility.warning('Seleccione la SubEntidad Financiera');
            return
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
    }

    const getValuePayment = () => {
        let valuePayment = 0;
        const NUM_MAX_ROUND = 5;
        const { voucher } = state.checkout;
        if (Number(voucher.receivedAmount) >= voucher.totalBalance) {
            valuePayment = RoundNumber(voucher.totalBalance, NUM_MAX_ROUND);
        } else {
            valuePayment = RoundNumber(Number(voucher.receivedAmount), NUM_MAX_ROUND)
        }
        return valuePayment;
    }

    const save = async () => {
        const { voucher, dataForm, payments } = state.checkout;
        const { paymentSubTypes, voucherQuotas } = dataForm; 
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
            if (!isValidData()) throw "Form Invalid";

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

            showLoader();
            accountReceivableSvc.post(data).then(response => {
                if (response.code === "1") {
                    SnackbarUtility.success(response.message);

                    if (state.checkoutParams.printerAutomatic) {
                        SharedService.getPrinter({
                            id: state.checkoutParams.orderId,
                            documentoId: state.checkoutParams.idDocumento,
                            tipo: 1
                        })
                    }
                    state.closeDialog();
                } else {
                    SnackbarUtility.warning(response.message)
                }
            }).finally(() => hideLoader())


        } catch (error) {
            console.log(error)
        }
    }

    // Proporciona el estado y las funciones del contexto a los componentes hijos    
    return (
        <CheckoutContext.Provider value={{
            ...state,
            fetchCheckout,
            setPayment,
            onChangeReceivedAmount,
            handleChangeSetReceivedAmount,
            handleClickOptionReceivedAmount,
            checkoutClearButton,
            save
        }}>
            {children}
        </CheckoutContext.Provider>
    )
}


// Exporta un hook personalizado para acceder al contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useCheckoutContext = () => {
    return useContext(CheckoutContext)
}