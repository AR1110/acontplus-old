
import { useCheckoutStore } from '@/stores'
import { Calculator } from '../..'

const CheckoutCalculator = () => {
    const handleChangeSetReceivedAmount = useCheckoutStore(state=>state.handleChangeSetReceivedAmount)
    const handleClickOptionReceivedAmount = useCheckoutStore(state=>state.handleClickOptionReceivedAmount)
    const checkoutClearButton = useCheckoutStore(state=>state.checkoutClearButton)
 

    return (
        <Calculator
            clearButton={checkoutClearButton} //Event for button "X"
            onClickButton={handleChangeSetReceivedAmount} //Event for keyword numeric + "x","."
            onClickOptionValue={handleClickOptionReceivedAmount} //Event for value $5, $10, $20
        />
    )
}

export default CheckoutCalculator