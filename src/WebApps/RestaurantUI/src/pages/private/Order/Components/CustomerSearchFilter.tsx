
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState } from 'react';
import { CustomerReadDto } from '@/core/models';
import { customerService } from '@/core/services';
import { Box, Typography } from '@mui/material'; 
import { useOrderContext } from '../context';

 
const CustomerSearchFilter = () => {
    const [customers, setCustomers] = useState<Array<CustomerReadDto>>([]);
    const {setDataFilter, dataFilter } = useOrderContext(); 

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
            freeSolo
            value={dataFilter.customerName}
            autoHighlight
            getOptionLabel={(option) => {
                if (typeof option === 'string') {
                    return option;
                }
                return `${option.fiscalName}`
            }}
            onChange={(_e, _v, _r, details) => {
                const customerData = details?.option; 
                
                setDataFilter('customerName', customerData?.fiscalName ?? "");  
                setDataFilter('customerCompanyId', customerData?.customerCompanyId ?? 0);
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
