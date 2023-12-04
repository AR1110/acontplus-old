import {
    CheckoutDataForm,
    CheckoutParams,
    CheckoutState,
    MultiplesPaymentType,
    Payment,
    PaymentDetail,
    PaymentSubType,
    VoucherQuota
} from "@/core/models";
import {
    GET_CHECKOUT_BEGIN,
    GET_CHECKOUT_SUCCESS,
    GET_CHECKOUT_ERROR,
    SET_ADD_PAYMENT_DATA,
    SET_RECEIVE_AMOUNT,
    SET_CHANGE_RETURN,
    SET_OPTION_RECEIVED_AMOUNT,
    SET_REPLACE_RECEIVED_AMOUNT,
    SET_CHANGE_PAYMENT_TYPE_DATA,
    SET_REMOVE_PAYMENT_TYPE,
} from '.'
import { PaymentTypeCode } from "@/core/constants";
import { RoundNumber } from "@/core/utilities";
import CheckoutUtility, { getCheckoutSubTotales, getTotalesCuota } from "@/core/utilities/checkout.utility";

type CheckoutAction =
    | { type: typeof GET_CHECKOUT_BEGIN }
    | {
        type: typeof GET_CHECKOUT_SUCCESS, payload: {
            data: CheckoutDataForm,
            closeDialog(): void,
            checkoutParams: CheckoutParams
        }
    }
    | { type: typeof GET_CHECKOUT_ERROR }
    | {
        type: typeof SET_CHANGE_PAYMENT_TYPE_DATA, payload: {
            paymentData: Payment,
            paymentSubTypes: Array<PaymentSubType>
        }
    }
    | {
        type: typeof SET_ADD_PAYMENT_DATA, payload: {
            voucherQuotas: Array<VoucherQuota>,
            dataPaymentTypeForm: MultiplesPaymentType,
            paymentDetails: Array<PaymentDetail>,
        }
    }
    | {
        type: typeof SET_REMOVE_PAYMENT_TYPE, payload: number
    }
    | { type: typeof SET_RECEIVE_AMOUNT, payload: string }
    | { type: typeof SET_CHANGE_RETURN }
    | { type: typeof SET_OPTION_RECEIVED_AMOUNT, payload: boolean }
    | { type: typeof SET_REPLACE_RECEIVED_AMOUNT, payload: boolean }

export const checkoutReducer = (state: CheckoutState, action: CheckoutAction): CheckoutState => {

    switch (action.type) {
        case GET_CHECKOUT_BEGIN:
            return { ...state, checkoutLoading: true }
        case GET_CHECKOUT_SUCCESS: {
            const { data, closeDialog, checkoutParams } = action.payload;
            const { paymentTypes, voucherQuotas } = data;
            const paymentData = paymentTypes.find(item => item.code === PaymentTypeCode.EFE);
            if (paymentData) {
                state.checkout.paymentSubTypes = paymentData.paymentSubTypes;
                state.checkout.paymentData.paymentTypeId = paymentData.paymentTypeId;
                state.checkout.paymentData.paymentTypeCode = paymentData.code
                state.checkout.paymentData.paymentTypeDescription = paymentData.description;
                const paymentSubTypeData = state.checkout.paymentSubTypes[0]
                if (paymentSubTypeData) {
                    state.checkout.paymentData.paymentSubTypeId = paymentSubTypeData.paymentSubTypeId;
                }
            }
            const filteredPaymentTypes = paymentTypes.filter(payment => payment.code !== "DOC")
            state.checkout.dataForm = {
                ...data,
                paymentTypes: filteredPaymentTypes
            }
    
            state.checkout.voucher = data.comprobante;
            state.checkout.dataSubTotal = getTotalesCuota(voucherQuotas)
            return {
                ...state,
                closeDialog,
                checkoutParams: checkoutParams,
                checkoutLoading: false
            }
        }
        case GET_CHECKOUT_ERROR:
            return { ...state, checkoutError: true, checkoutLoading: false }

        case SET_CHANGE_PAYMENT_TYPE_DATA: {

            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    paymentData: action.payload.paymentData,
                    paymentSubTypes: action.payload.paymentSubTypes
                }
            }
        }
        case SET_ADD_PAYMENT_DATA: {
            const {
                voucherQuotas,
                dataPaymentTypeForm,
                paymentDetails,
            } = action.payload;
            // const payments = state.checkout.payments;
            // const obj = Object.assign(payments, action.payload);
            // return {
            //     ...state,
            //     checkout: Object.assign(state.checkout, obj)
            // }
            const tempMultiplesPaymentType = [...state.checkout.multiplesPaymentType, dataPaymentTypeForm];

            const dataSubTotal = getCheckoutSubTotales(voucherQuotas, tempMultiplesPaymentType, state.checkout.dataForm.comprobante)

            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    voucher: {
                        ...state.checkout.voucher,
                        totalBalance: dataSubTotal.totalSaldo,
                        totalValorAbono: dataSubTotal.totalValorAbono,
                        changeReturn: dataSubTotal.valorCambio,
                        receivedAmount: dataSubTotal.totalSaldo.toString()
                    },
                    dataForm: {
                        ...state.checkout.dataForm,
                        voucherQuotas: voucherQuotas,
                    },
                    multiplesPaymentType: tempMultiplesPaymentType,
                    paymentDetails: paymentDetails,
                    paymentData: {
                        ...state.checkout.paymentData,
                        nro: "",
                        referencia: "",
                        aprobacion: "",
                        lote: "",
                        cityId: 0,
                        idBanco: 0
                    }
                }
            }
        }

        case SET_REMOVE_PAYMENT_TYPE: {
            const indexToExclude = action.payload;
            let paymentDetails: Array<PaymentDetail> = [];
            const tempMultiplesPaymentType = state.checkout.multiplesPaymentType.filter((_, index) => index !== indexToExclude)


            //Todas las cuotas en su estado original 
            let tempVoucherQuotas = state.checkout.dataForm.voucherQuotas.map(vc => ({
                ...vc,
                cuotas: structuredClone(vc.cloneCuotas)
            }))

            state.checkout.dataSubTotal = getTotalesCuota(tempVoucherQuotas)

            //if (tempMultiplesPaymentType.length == 0) return state;

            //Recalculamos las cuotas con los abonos restantes   
            let sequential = 0;
            for (const item of tempMultiplesPaymentType) {
                sequential++;

                const checkoutUtility = new CheckoutUtility(sequential);
                checkoutUtility.setReceivedAmount(Number(item.receivedAmount))

                tempVoucherQuotas = checkoutUtility.applyReceivedAmountToQuota(tempVoucherQuotas);
                paymentDetails = checkoutUtility.paymentDetails;
            }
            const dataSubTotal = getCheckoutSubTotales(tempVoucherQuotas, tempMultiplesPaymentType, state.checkout.dataForm.comprobante)


            console.log(tempMultiplesPaymentType)
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    voucher: {
                        ...state.checkout.voucher,
                        totalBalance: dataSubTotal.totalSaldo,
                        totalValorAbono: dataSubTotal.totalValorAbono,
                        changeReturn: dataSubTotal.valorCambio,
                        receivedAmount: dataSubTotal.totalSaldo.toString()
                    },
                    dataForm: {
                        ...state.checkout.dataForm,
                        voucherQuotas: tempVoucherQuotas,
                    },
                    multiplesPaymentType: tempMultiplesPaymentType,
                    paymentDetails: paymentDetails,
                    paymentData: {
                        ...state.checkout.paymentData,
                        nro: "",
                        referencia: "",
                        aprobacion: "",
                        lote: "",
                        cityId: 0,
                        idBanco: 0
                    }
                }
            }
        }
        case SET_RECEIVE_AMOUNT: {
            const voucher = Object.assign(state.checkout.voucher, {
                receivedAmount: action.payload
            })
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    voucher
                }
            }
        }
        case SET_CHANGE_RETURN: {
            const { payingAmount, receivedAmount } = state.checkout.voucher;
            let changeReturn = 0;
            const receivedAmountValue = parseFloat(receivedAmount)
            if (receivedAmountValue > payingAmount) {
                changeReturn = receivedAmountValue - payingAmount;
            }

            const voucher = Object.assign(state.checkout.voucher, {
                changeReturn: RoundNumber(changeReturn, 2)
            })
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    voucher
                }
            }
        }

        case SET_OPTION_RECEIVED_AMOUNT:
            state.isOptionReceivedAmount = action.payload;
            return {
                ...state,
                isOptionReceivedAmount: action.payload
            }

        case SET_REPLACE_RECEIVED_AMOUNT:
            return {
                ...state,
                isReplaceReceivedAmount: action.payload
            }

        default:
            return state;
    }
}