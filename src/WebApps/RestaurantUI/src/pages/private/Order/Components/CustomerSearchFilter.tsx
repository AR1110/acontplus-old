
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState } from 'react';
import { CustomerReadDto } from '@/core/models';
import { customerService } from '@/core/services';
import { Box, Typography } from '@mui/material';
import { useOrderStore } from '@/stores';

 
const CustomerSearchFilter = () => {
    const [customers, setCustomers] = useState<Array<CustomerReadDto>>([]);
    const setOrderFilter = useOrderStore(state=>state.setOrderFilter)
    const orderFilter = useOrderStore(state=>state.orderFilter)
    const getOrders = useOrderStore(state=>state.getOrders)

    const onInputChange = (newValue: string) => {
        if (newValue.length > 0) {
            customerService.search(newValue).then(response => {
                setCustomers(response)
            })
        }
    }
    return (
        <Autocomplete
            onInputChange={(_, newValue) => onInputChange(newValue)}
            id="customerSearchFilter"
            options={customers}
            sx={{ width: 300 }}
            autoHighlight
            getOptionLabel={(option) => option.fiscalName}
            onChange={(_, customer)=>{   
                setOrderFilter({
                    ...orderFilter,
                    customerCompanyId: customer?.customerCompanyId ?? 0
                })
                getOrders()
            }}
            isOptionEqualToValue={(option, value)=>option.customerCompanyId===value.customerCompanyId}
            renderOption={(props, option) => (
                <li {...props}>
                    <Box
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        <Typography variant="subtitle2" gutterBottom>
                            {option.identificationNumber}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {option.tradeName}
                        </Typography> 
                    </Box>
                </li>
            )}
            renderInput={(params) => <TextField  {...params} label="Cliente" />}
        />
    );
}

export default CustomerSearchFilter;
