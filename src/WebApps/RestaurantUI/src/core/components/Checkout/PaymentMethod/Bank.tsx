
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete'; 
import { useCheckoutContext } from '../context';

export default function Bank() {
    const {checkout, setChangeFieldFormPayment} = useCheckoutContext(); 
    const {dataForm} = checkout

    const banks = dataForm.banks; 
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
                            setChangeFieldFormPayment("idBanco", bankId)     
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
