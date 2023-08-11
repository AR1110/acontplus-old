import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, ButtonGroup, IconButton, TextField, Typography } from '@mui/material';
import { AddIcon, DeleteIcon, RemoveIcon } from '@/core/components';
import soundClear from '/sound/button-21.mp3';
import { useState } from 'react';
import { saleStore } from '@/stores/saleStore';
import { shallow } from 'zustand/shallow';
 
export default function ShoppingCart() {
   const items = saleStore(state=>state.items);
   console.log(items);
  const clearSound = () => {
    playSound(soundClear);
  }


  function playSound(src: string): void {
    const sound = new Audio();
    sound.src = src;
    sound.play();
    sound.onended = () => {
      // eslint-disable-next-line no-delete-var

    };
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 300 }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell align="center">Cant.</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography color="text.secondary" variant="caption" display="block" gutterBottom>
                  {item.description}                    
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <ButtonGroup>
                    <Button
                      aria-label="reduce"

                    >
                      <RemoveIcon fontSize="small" />
                    </Button>
                    <TextField
                    value={item.cantidad}
                      variant="outlined"
                      inputProps={{ style: { textAlign: 'center' } }}
                      size='small'
                    // Add other TextField props here as needed
                    />
                    <Button
                      aria-label="increase"

                    >
                      <AddIcon fontSize="small" />
                    </Button>
                  </ButtonGroup>
                </TableCell>
                <TableCell align="right">{item.unitPrice}</TableCell>
                <TableCell align="right">{item.total}</TableCell>
                <TableCell align="center">
                  <IconButton aria-label="delete" onClick={clearSound}>
                    <DeleteIcon color='error' />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
