import Calculator from '../../Calculator/Calculator'
import { useCheckoutContext } from '../context';


const CheckoutCalculator = () => {
    const { handleChangeSetReceivedAmount, handleClickOptionReceivedAmount, checkoutClearButton } = useCheckoutContext();
    return (
        <Calculator
            clearButton={checkoutClearButton} //Event for button "X"
            onClickButton={handleChangeSetReceivedAmount} //Event for keyword numeric + "x","."
            onClickOptionValue={handleClickOptionReceivedAmount} //Event for value $5, $10, $20
        />
    )
}

export default CheckoutCalculator