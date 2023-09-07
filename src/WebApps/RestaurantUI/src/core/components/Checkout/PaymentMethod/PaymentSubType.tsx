import { useCheckoutStore } from "@/stores";
import { MenuItem, TextField } from "@mui/material";

 
const PaymentSubType = () => { 
    const payments = useCheckoutStore(state => state.checkout.payments);
    const paymentSubTypes = useCheckoutStore(state => state.checkout.dataForm.paymentSubTypes);
    const setPayment = useCheckoutStore(state => state.setPayment);
    return (
        <>
            {paymentSubTypes.length > 0 && <TextField fullWidth
                id="paymentType"
                name="paymentType"
                label="SubEntidad Financiera"
                select
                value={payments.paymentSubtypeId}
                onChange={(e) => {
                    const paymentData = paymentSubTypes.find(item => item.paymentSubtypeId === Number(e.target.value));
                    setPayment({
                        ...payments,
                        paymentSubtypeId: paymentData?.paymentSubtypeId ?? 0,

                    })
                    console.log(e.target.value)
                }}
            >
                {
                    paymentSubTypes.map((item, index) => (
                        <MenuItem value={item.paymentSubtypeId} key={index}>
                            {item.description}
                        </MenuItem>
                    ))
                } 
            </TextField>
            }
        </>
    )
}

export default PaymentSubType