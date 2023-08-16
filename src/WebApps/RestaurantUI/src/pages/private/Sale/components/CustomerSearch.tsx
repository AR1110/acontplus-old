import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase'; 
import IconButton from '@mui/material/IconButton'; 
import CircularProgress from '@mui/material/CircularProgress';
import { PersonOutlineIcon, PersonSearchIcon } from '@/core/components';

import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { CustomerReadDto } from '@/core/models';
import {CustomerService as customerSvc}  from '@/core/services';
 

export default function CustomerSearch() { 
  const [value, setValue] = React.useState<CustomerReadDto | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [customers, setCustomers] = useState<Array<CustomerReadDto>>([]);
  const [loading, setLoading] = useState(false);
  
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
  fullWidth
  onInputChange={handleInputChange}
  autoHighlight
  getOptionLabel={(option) => option.taxName}
  options={customers}
  loading={loading}
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
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <React.Fragment>
            {loading ? <CircularProgress color="inherit" size={20} /> : null}
            {params.InputProps.endAdornment}
          </React.Fragment>
        ),
      }}
    />
  )}
/>

  );
}
 