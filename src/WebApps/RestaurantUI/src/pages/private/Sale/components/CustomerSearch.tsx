import * as React from 'react'; 
import CircularProgress from '@mui/material/CircularProgress'; 

import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { CustomerReadDto } from '@/core/models';
import {CustomerService as customerSvc}  from '@/core/services';
import { useSaleStore } from '@/stores';
 

export default function CustomerSearch() { 
  const [value, setValue] = useState<CustomerReadDto | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [customers, setCustomers] = useState<Array<CustomerReadDto>>([]);
  const [loading, setLoading] = useState(false);
  const setSummary = useSaleStore(state=>state.setSummary)
  const summary = useSaleStore(state=>state.order)
  
  const customerSearch =  (textSearch: string) => { 
    if(textSearch.length < 2) return
    setLoading(true);
    setCustomers([])
    customerSvc.search(textSearch).then(response=>{
      console.log(response) 
      setCustomers(response)
    }).finally(()=>{
      setLoading(false);
    })
    // console.log(event)
  }

  const handleInputChange = (event: any, value: string) => {
    console.log(event)
     customerSearch(value)
  };

  return (   
  <Autocomplete
  id="customer-search" 
  size='small'
  fullWidth  
  onInputChange={handleInputChange}
  autoHighlight
  getOptionLabel={(option) => option.taxName}
  options={customers}
  loading={loading}
  onChange={(event, newValue) => {
    if (newValue) {
      // Aquí tienes el valor seleccionado (newValue)
      console.log(newValue.customerId, event);
      setSummary({
        ...summary,
        customerCompanyId: newValue.customerId
      })
    }
  }}
  renderOption={(props, option) => {
    console.log(props)
    console.log(option)
    return (
      <li {...props}>
        <Grid container alignItems="center"> 
          <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
            
              <Box  component="span"  >
                 {option.taxName}
              </Box>
            
            <Typography variant="body2" color="text.secondary">
              {option.identificationNumber}
            </Typography>
          </Grid>
        </Grid>
      </li>
    )
            }}
  
  renderInput={(params) => (
    <TextField
      {...params}
      label="Cliente"
      margin='normal'
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <React.Fragment>
            {loading ? <CircularProgress color="inherit"   /> : null}
            {params.InputProps.endAdornment}
          </React.Fragment>
        ),
      }}
    />
  )}
/>

  );
}
 