
import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import LeftOrderItem from './LeftOrderItem/LeftOrderItem';
import RightOrderItem from './RightOrderItem/RightOrderItem';
import { useSplitOrderContext } from '../context';
import MiddleAction from './MiddleAction/MiddleAction';
import Checkout from '@/core/components/Checkout/Checkout';

 
type Props = {
    id: number
    closeDialogDivide<T>(value?:T): void
}
const SplitOrder = ({ id, closeDialogDivide }: Props) => {
    const { actionType, fetchOrderData, setPaymentData, payment, leftOrder } = useSplitOrderContext();

    useEffect(() => {
        fetchOrderData(id); 
    }, [])

    const closePayment = () => {
        if (actionType === "CUSTOM_DETAIL") {
            closeDialogDivide("CUSTOM_DETAIL");
        } else {
            fetchOrderData(leftOrder.orderId);
            setPaymentData({
                payment: {
                    open: false,
                    payload: {}
                }
            })
        }
    }
    return (
        <>
            <Grid container spacing={2} justifyContent="center" alignItems="center" columns={16}>
                <Grid item xs={16} sm={7} md={7} lg={7}>
                    <LeftOrderItem />
                </Grid>
                <Grid item>
                    <MiddleAction />
                </Grid>
                <Grid item xs={16} sm={7} md={7} lg={7}>
                    <RightOrderItem />
                </Grid>
            </Grid>
            {
                payment.open && <Checkout open={payment.open} closeDialog={closePayment} params={payment.payload} />
            }
        </>
    );
}

export default SplitOrder;