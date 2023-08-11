 
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { IconButton, TextField, Typography } from '@mui/material';
import { AddShoppingCartIcon, DeleteIcon } from '@/core/components'; 
import { saleStore } from '@/stores/saleStore'; 

export default function ShoppingCart() {
  const items = saleStore(state => state.items);
  const removeItemFromCart = saleStore(state => state.removeItemFromCart) 

  if (items.length === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <AddShoppingCartIcon sx={{
        height: "5rem!important",
        width: '5rem',
        color: 'rgba(59, 130, 246, 0.5)'
      }} />

      <Typography color="text.secondary" variant="caption">CARRITO VACÍO</Typography>
    </div>
  )

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
                <TableCell align='left'>
                  <Typography color='text.secondary' variant='caption' sx={{
                    wordBreak: 'break-all'
                  }}>
                    {item.description}
                  </Typography>
                </TableCell>
                <TableCell align="center" style={{ minWidth: 10 }}>
                  <TextField
                    value={item.cantidad}
                    variant="outlined"
                    inputProps={{ style: { textAlign: 'center', padding: '4px', width: '100%', fontSize: '5' } }}
                    size="small"
                  // Add other TextField props here as needed
                  />

                </TableCell>
                <TableCell align="right">{item.unitPrice}</TableCell>
                <TableCell align="right">{item.total}</TableCell>
                <TableCell align="center">
                  <IconButton aria-label="delete" onClick={() => removeItemFromCart(item.productId)}>
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
