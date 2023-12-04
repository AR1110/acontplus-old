import { createContext, useContext, useReducer } from "react";
import axios, { CancelTokenSource } from "axios";
import { CheckoutState, CheckoutActions, initialCheckoutState, Payment, CheckoutParams, PaymentSubType } from "@/core/models";
import {
    GET_CHECKOUT_BEGIN,
    GET_CHECKOUT_ERROR,
    GET_CHECKOUT_SUCCESS,
    SET_ADD_PAYMENT_DATA,
    SET_CHANGE_PAYMENT_TYPE_DATA,
    SET_OPTION_RECEIVED_AMOUNT,
    SET_RECEIVE_AMOUNT,
    SET_REMOVE_PAYMENT_TYPE,
    SET_REPLACE_RECEIVED_AMOUNT,
    checkoutReducer
} from ".";
import { SharedService, accountReceivableService as accountReceivableSvc } from "@/core/services";
import { CheckoutUtility, SnackbarUtility } from "@/core/utilities";
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
    setChangePaymentType: () => [],
    setChangeFieldFormPayment: () => [],
    addPaymentType: () => [],
    removePaymentType: () => [],
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



    function setChangePaymentType(data: Partial<Payment>, paymentSubTypes: PaymentSubType[]) {
        const paymentData = {
            ...state.checkout.paymentData,
            ...data
        }
        dispatch({
            type: SET_CHANGE_PAYMENT_TYPE_DATA, payload: {
                paymentData,
                paymentSubTypes
            }
        });

    }
    function setChangeFieldFormPayment<T extends keyof typeof state.checkout.paymentData>(prop: T, value: typeof state.checkout.paymentData[T]) {
        const paymentData = {
            ...state.checkout.paymentData,
            [prop]: value,
        }
        dispatch({
            type: SET_CHANGE_PAYMENT_TYPE_DATA, payload: {
                paymentData,
                paymentSubTypes: state.checkout.paymentSubTypes
            }
        });

    }



    function addPaymentType() {
        try {
            const {
                voucher,
                dataForm,
                paymentData,
                multiplesPaymentType,
                paymentSubTypes,
                paymentDetails
            } = state.checkout;
            const { voucherQuotas } = dataForm;
            if (voucher.totalBalance == 0 || voucher.totalBalance < 0) {
                Swal.fire({
                    icon: 'warning',
                    html: 'No tienes saldo pendiente!'
                })
                return
            }
            if (!isValidData()) return;
            const tempPaymentDetails = structuredClone(paymentDetails);

            const sequential = multiplesPaymentType.length;
            const checkoutUtility = new CheckoutUtility(sequential);
            checkoutUtility.setReceivedAmount(Number(voucher.receivedAmount))
            checkoutUtility.setPaymentDetail(tempPaymentDetails)

            const modifiedQuotas = checkoutUtility.applyReceivedAmountToQuota(voucherQuotas);
            const resultPaymentDetails = checkoutUtility.paymentDetails;
            
            const payingAmount = resultPaymentDetails.filter(item => item.secuencial === sequential)
                .reduce((prev, curr) => prev + curr.abono, 0)

            const dataPaymentSubType = paymentSubTypes.find(item => item.paymentSubTypeId === paymentData.paymentSubTypeId)
            const infoCobro = [{
                nro: paymentData.nro,
                lote: paymentData.lote,
                aprobacion: paymentData.aprobacion,
                referencia: paymentData.referencia,
                idCiudad: paymentData.cityId
            }]
            const dataPaymentTypeForm = {
                paymentTypeId: paymentData.paymentTypeId,
                paymentSubTypeId: paymentData.paymentSubTypeId,
                idBanco: paymentData.idBanco,
                creationDate: new Date(),
                receivedAmount: Number(voucher.receivedAmount),
                payingAmount,
                sequential,
                isControlBox: dataPaymentSubType?.isControlBox || false,
                paymentTypeCode: paymentData.paymentTypeCode,
                paymentTypeDescription: paymentData.paymentTypeDescription,
                posfechado: paymentData.posfechado,
                nro: paymentData.nro,
                lote: paymentData.lote,
                aprobacion: paymentData.aprobacion,
                referencia: paymentData.referencia,
                idCiudad: paymentData.cityId,
                infoCobro: paymentData.paymentTypeCode === PaymentTypeCode.EFE ? undefined : JSON.stringify(infoCobro),
                paymentSubTypeName: dataPaymentSubType?.description || "",
                idCuentaBancaria: 0,
            }

            const payload = {
                voucherQuotas: modifiedQuotas,
                dataPaymentTypeForm: dataPaymentTypeForm,
                paymentDetails: resultPaymentDetails,
            }
            dispatch({ type: SET_ADD_PAYMENT_DATA, payload });
            SnackbarUtility.success('Agregado correctamente')
        } catch (error) {
            console.log(error)
            SnackbarUtility.error(error as string)
        }

    }

    function removePaymentType(index: number) {
        try {
            Swal.fire({
                html: `<small>Esta seguro/a de eliminar este Abono ahora?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'No, cancelar'
            }).then(result => {
                if (result.isConfirmed) {
                    dispatch({
                        type: SET_REMOVE_PAYMENT_TYPE, payload: index
                    });

                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const setReceivedAmount = (payload: string) => {
        dispatch({ type: SET_RECEIVE_AMOUNT, payload });
    }

    // const setChangeReturn = () => {
    //     dispatch({ type: SET_CHANGE_RETURN });
    // }

    const onChangeReceivedAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { voucher } = state.checkout;
        const inputValue = event.target.value.replace(/[^0-9.]/g, '');
        // Utilizar replace para eliminar el primer dígito "0" si no hay un punto después
        const resultValueIngreasada = inputValue.replace(/^0(?![.])/, '');
        const numeroStr = voucher.receivedAmount.toString();
        if (!inputValue) {
            setTimeout(() => {
                setReceivedAmount('0')
                event.target.select();
                // setChangeReturn()
            }, 0);
            return
        }

        if (numeroStr === "0") {
            setReceivedAmount('')
        }
        setTimeout(() => {
            setReceivedAmount(resultValueIngreasada)
            // setChangeReturn()
        }, 0)
    }

    const handleChangeSetReceivedAmount = (value: number | string) => {
        const { voucher } = state.checkout;

        const numeroStr = voucher.receivedAmount.toString();
        const valueCalculator = value.toString();
        if (numeroStr === "0" && (valueCalculator === "0")) return


        if (value === "." && numeroStr.split(".").length > 1) return

        if (numeroStr === "0" && valueCalculator === '.') {
            setReceivedAmount(numeroStr + valueCalculator);
            //   setChangeReturn()
            return
        }
        if (numeroStr === "0" || state.isOptionReceivedAmount) {
            setReceivedAmount(valueCalculator);
            setIsOptionReceivedAmount(false);
            // setChangeReturn()
            return
        }
        if (state.isReplaceReceivedAmount) {
            setReceivedAmount(valueCalculator)
            setIsReplaceReceivedAmount(false);
            //setChangeReturn()
            return
        }

        setReceivedAmount(numeroStr + valueCalculator)
        // setChangeReturn()
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
        //const { voucher } = state.checkout;
        //let valueReceivedAmount = 0;
        // if (Number(voucher.receivedAmount)===0){
        //     valueReceivedAmount = value
        // }else{
        //     valueReceivedAmount = Number(voucher.receivedAmount) + value;
        // } 
        setReceivedAmount(value.toString());
        setIsOptionReceivedAmount(true)
        // setChangeReturn()
    }
    const checkoutClearButton = () => {
        try {
            const { voucher } = state.checkout;

            const numeroStr = voucher.receivedAmount.toString();
            let receivedAmount = "0";

            if (voucher.receivedAmount === "0") {
                setReceivedAmount(receivedAmount);
                // setChangeReturn()
                return
            }
            if (voucher.receivedAmount !== "0") {
                const nuevoNumeroStr = numeroStr.substring(0, numeroStr.length - 1); // Elimina los últimos "cantidad" dígitos
                receivedAmount = nuevoNumeroStr ? nuevoNumeroStr : '0';
            }
            setReceivedAmount(receivedAmount)
            // setChangeReturn()
        } catch (error) {
            console.log(error)
        }
    }

    const isValidData = () => {
        const { paymentData } = state.checkout;
        if (!(paymentData.paymentSubTypeId > 0)) {
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
        if (paymentData.paymentTypeCode === PaymentTypeCode.TAR) {
            if (!paymentData.nro) {
                SnackbarUtility.warning('Ingrese el Número')
                return
            }

            if (!(paymentData.cityId && paymentData.cityId > 0)) {
                SnackbarUtility.warning('Ingrese la Ciudad')
                return
            }
            if (!paymentData.referencia) {
                SnackbarUtility.warning('Ingrese la referencia')
                return
            }
            if (!paymentData.aprobacion) {
                SnackbarUtility.warning('Ingrese la Aprobación')
                return
            }
            if (!paymentData.lote) {
                SnackbarUtility.warning('Ingrese el Lote')
                return
            }
        }

        // =================== TRANSFERENCIAS  =================================== //

        if (paymentData.paymentTypeCode === PaymentTypeCode.TRA) {
            if (!(paymentData.idBanco && paymentData.idBanco > 0)) {
                SnackbarUtility.warning('Seleccione el Banco')
                return
            }
            if (!paymentData.nro) {
                SnackbarUtility.warning('Ingrese el Número')
                return
            }
        }

        // =================== CHEQUES  =================================== //

        if (paymentData.paymentTypeCode === PaymentTypeCode.CHE) {
            if (!(paymentData.idBanco && paymentData.idBanco > 0)) {
                SnackbarUtility.warning('Seleccione el Banco')
                return
            }
            if (!paymentData.nro) {
                SnackbarUtility.warning('Ingrese el Número')
                return
            }

            if (!(paymentData.cityId && paymentData.cityId > 0)) {
                SnackbarUtility.warning('Ingrese la Ciudad')
                return
            }
            if (!paymentData.referencia) {
                SnackbarUtility.warning('Ingrese a quien va dirigido el Cheque')
                return
            }
        }

        return true;
    }

    // const getValuePayment = () => {
    //     let valuePayment = 0;
    //     const NUM_MAX_ROUND = 5;
    //     const { voucher } = state.checkout;
    //     if (Number(voucher.receivedAmount) >= voucher.totalBalance) {
    //         valuePayment = RoundNumber(voucher.totalBalance, NUM_MAX_ROUND);
    //     } else {
    //         valuePayment = RoundNumber(Number(voucher.receivedAmount), NUM_MAX_ROUND)
    //     }
    //     return valuePayment;
    // }

    const save = async () => {
        const { voucher, dataForm, multiplesPaymentType, paymentDetails } = state.checkout;
        try {
            if (!(voucher.customerCompanyId > 0)) {
                Swal.fire({
                    icon: 'info',
                    html: 'Seleccione el cliente'
                })
                return
            }
            if (multiplesPaymentType.length === 0) {
                Swal.fire({
                    icon: 'info',
                    html: 'Ingrese al menos un abono'
                })
                return
            }

            if (paymentDetails.length === 0) {
                Swal.fire({
                    icon: 'info',
                    html: 'Cobro detalle vacio!'
                })
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

            const checkoutUtility = new CheckoutUtility(0);
            const historyPayments = checkoutUtility.getHistoryPayments(dataForm.voucherQuotas, paymentDetails);
            const comprobante = {
                idCliente: voucher.customerCompanyId,
                total: multiplesPaymentType.reduce((acc, curr) => acc + curr.receivedAmount, 0),
                abono: multiplesPaymentType.reduce((acc, curr) => acc + curr.payingAmount, 0),
                codEstab: voucher.codEstab,
                numeroIdentificacion: voucher.customerIdentification,
                nombreFiscal: voucher.customerName,
            }

            const cobros = multiplesPaymentType.map(item => {

                const obj = {
                    idEntidadFinanciera: item.paymentTypeId,
                    idSubEntidadFinanciera: item.paymentSubTypeId,
                    idBanco: item.idBanco,
                    idCuentaBancaria: 0,
                    fechaEmision: item.creationDate,
                    valor: item.receivedAmount,
                    posfechado: item.posfechado,
                    secuencial: item.sequential,
                    infoCobro: item.infoCobro,
                    abono: item.payingAmount,
                    controlCaja: item.isControlBox,
                }
                return obj;
            })

            const data = {
                comprobante,
                cobros,
                cobroDetalle: paymentDetails.filter(item => (item.abono > 0)),
                historial: historyPayments,
            } 

            showLoader();
            accountReceivableSvc.post(data).then(response => {
                if (response.code === "1") {
                    SnackbarUtility.success(response.message);

                    if (state.checkoutParams.printerAutomatic) {
                        if (["01", 'FV'].includes(state.checkoutParams.codDoc)) {
                            SharedService.getPrinter({
                                id: state.checkoutParams.orderId,
                                documentoId: state.checkoutParams.idDocumento,
                                tipo: 3
                            })
                        }
                        if (['NE'].includes(state.checkoutParams.codDoc)) {
                            SharedService.getPrinter({
                                id: state.checkoutParams.orderId,
                                documentoId: state.checkoutParams.idDocumento,
                                tipo: 4
                            })
                        }
                    }
                    state.closeDialog("REFRESH");
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
            setChangePaymentType,
            setChangeFieldFormPayment,
            addPaymentType,
            removePaymentType,
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