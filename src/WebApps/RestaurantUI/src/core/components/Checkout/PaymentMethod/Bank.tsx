
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useCheckoutStore } from '@/stores';

export default function Bank() {
    const banks = useCheckoutStore(state => state.checkout.dataForm.banks);
    const payments = useCheckoutStore(state => state.checkout.payments);
    const setPayment = useCheckoutStore(state => state.setPayment);
    return (
        <>
            {
                banks.length > 0 && (
                    <Autocomplete
                        fullWidth
                        disablePortal
                        id="banco" 
                        onChange={(_, newValue) => { 
                            const bankId = newValue? newValue.bankId : 0                           
                            setPayment({
                                ...payments,
                                idBanco: bankId

                            })
                          }}
                        options={banks}
                        getOptionLabel={(option) => option.description}
                        renderInput={(params) => <TextField {...params} label="Banco" />}
                    />
                )
            }
        </>
    );
}
