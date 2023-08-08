import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase'; 
import IconButton from '@mui/material/IconButton'; 
import { PersonOutlineIcon } from '@/core/components';

export default function CustomerSearch() {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center',  borderRadius: '16px' }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="menu" color="primary">
        <PersonOutlineIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Buscar cliente"
        inputProps={{ 'aria-label': 'search google maps' }}
      />      
    </Paper>
  );
}