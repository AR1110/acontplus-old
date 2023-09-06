
import { Calculator } from '../..'

const CheckoutCalculator = () => {

    const checkoutClearButton = () => {
        // const numeroStr = voucher.receivedAmount.toString();
        // let receivedAmount = "0";
        // console.log(voucher.receivedAmount)
        // if (voucher.receivedAmount === "0") {
        //     setReceivedAmount(receivedAmount);
        //     setChangeReturn()
        //     return
        // }
        // if (voucher.receivedAmount !== "0") {
        //     const nuevoNumeroStr = numeroStr.substring(0, numeroStr.length - 1); // Elimina los últimos "cantidad" dígitos
        //     receivedAmount = nuevoNumeroStr ? nuevoNumeroStr : '0';
        // }
        // setReceivedAmount(receivedAmount)
        // setChangeReturn()
    }

    const handleChangeSetReceivedAmount = (value: number | string) => {
        // const numeroStr = voucher.receivedAmount.toString();
        // const valueCalculator = value.toString();
        // if (numeroStr === "0" && (valueCalculator === "0")) return


        // if (value === "." && numeroStr.split(".").length > 1) return

        // if (numeroStr === "0" && valueCalculator === '.') {
        //     setReceivedAmount(numeroStr + valueCalculator);
        //     setChangeReturn()
        //     return
        // }
        // if (numeroStr === "0" || isOptionReceivedAmount) {
        //     setReceivedAmount(valueCalculator);
        //     setIsOptionReceivedAmount(false);
        //     setChangeReturn()
        //     return
        // }
        // if (isReplaceReceivedAmount) {
        //     setReceivedAmount(valueCalculator)
        //     setIsReplaceReceivedAmount(false);
        //     setChangeReturn()
        //     return
        // }

        // setReceivedAmount(numeroStr + valueCalculator)
        // setChangeReturn()
    }

    const handleClickOptionReceivedAmount = (inputValue: number) => {
        // setReceivedAmount(inputValue.toString());
        // setIsOptionReceivedAmount(true)
        // setChangeReturn()
    }

    return (
        <Calculator
            clearButton={checkoutClearButton} //Event for button "X"
            onClickButton={handleChangeSetReceivedAmount} //Event for keyword numeric + "x","."
            onClickOptionValue={handleClickOptionReceivedAmount} //Event for value $5, $10, $20
        />
    )
}

export default CheckoutCalculator