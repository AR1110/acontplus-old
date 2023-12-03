import { MenuItem, TextField } from "@mui/material";
import { useCheckoutContext } from "../context";

 
const PaymentSubType = () => { 
    const {checkout, setPayment} = useCheckoutContext(); 
    const {dataForm, payments} = checkout

    const paymentSubTypes = dataForm.paymentSubTypes;
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
                        paymentSubtypeId: paymentData?.paymentSubtypeId ?? 0

                    }) 
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