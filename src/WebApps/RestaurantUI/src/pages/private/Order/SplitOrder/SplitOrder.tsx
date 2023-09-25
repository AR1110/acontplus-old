
import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import LeftOrderItem from './LeftOrderItem/LeftOrderItem';
import RightOrderItem from './RightOrderItem/RightOrderItem';
import { useSplitOrderContext } from '../context';
import MiddleAction from './MiddleAction/MiddleAction';
import Checkout from '@/core/components/Checkout/Checkout';


type Props = {
    id: number
    closeDialogDivide():void
}
const SplitOrder = ({ id, closeDialogDivide }: Props) => {
    const {setCloseDialogDivide, fetchOrderData, setPaymentData, payment, leftOrder } = useSplitOrderContext();

    useEffect(() => {
        fetchOrderData(id);
        setCloseDialogDivide(closeDialogDivide)
    }, [])

    const closePayment = () => {
        fetchOrderData(leftOrder.orderId)
        setPaymentData({
            payment: {
                open: false,
                payload: {}
            }
        })
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
                payment.open && <Checkout open={payment.open} closeDialog={closePayment} />
            }
        </>
    );
}

export default SplitOrder;