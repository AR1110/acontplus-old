import React from 'react'
import { useCheckoutContext } from '../context';
import { InputAdornment, TextField } from '@mui/material';
import { PaymentsIcon } from '../../IconsMaterial';

const InputReceivedAmount = () => {
    const { checkout, onChangeReceivedAmount } = useCheckoutContext();
     const { voucher} = checkout;
    const handleFocus = (event: any) => {
        event.target.select(); // Seleccionar el texto
    };
  return (
      <TextField
          fullWidth
           
          id="cashValue"
          name='cashValue'
          label="Valor Cobro"
          value={voucher.receivedAmount}
          onChange={onChangeReceivedAmount}
          onFocus={handleFocus}
          InputProps={{
              startAdornment: <InputAdornment position="start">
                  <PaymentsIcon />
              </InputAdornment>,
          }}
          inputProps={{
              style: {
                  textAlign: 'right',
                 // fontSize: 30,
              },
          }}
      />
  )
}

export default InputReceivedAmount