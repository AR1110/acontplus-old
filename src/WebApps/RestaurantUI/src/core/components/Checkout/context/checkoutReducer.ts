import { CheckoutDataForm, CheckoutParams, CheckoutState, Payment } from "@/core/models";
import {
    GET_CHECKOUT_BEGIN,
    GET_CHECKOUT_SUCCESS,
    GET_CHECKOUT_ERROR,
    SET_PAYMENT_DATA,
    SET_RECEIVE_AMOUNT,
    SET_CHANGE_RETURN,
    SET_OPTION_RECEIVED_AMOUNT,
    SET_REPLACE_RECEIVED_AMOUNT,
} from '.'
import { PaymentTypeCode } from "@/core/constants";
import { RoundNumber } from "@/core/utilities";

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
    | { type: typeof SET_PAYMENT_DATA, payload: Partial<Payment> }
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
            const { paymentTypes, paymentSubTypes } = data;
            const paymentData = paymentTypes.find(item => item.code === PaymentTypeCode.EFE);
            const paymentSubTypeData = paymentSubTypes.filter(item => item.paymentTypeId === paymentData?.paymentTypeId)[0];

            state.checkout.dataForm = data;
            state.checkout.payments.paymentTypeId = paymentData?.paymentTypeId ?? 0;
            state.checkout.payments.paymentSubtypeId = paymentSubTypeData?.paymentSubtypeId ?? 0;

            state.checkout.payments.paymentTypeCode = paymentData?.code
            state.checkout.payments.paymentTypeDescription = paymentData?.description;
            state.checkout.voucher = data.comprobante;
            return {
                ...state,
                closeDialog,
                checkoutParams: checkoutParams,
                checkoutLoading: false
            }
        }
        case GET_CHECKOUT_ERROR:
            return { ...state, checkoutError: true, checkoutLoading: false }

        case SET_PAYMENT_DATA: {
            const payments = state.checkout.payments;
            const obj = Object.assign(payments, action.payload);
            return {
                ...state,
                checkout: Object.assign(state.checkout, obj)
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