import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, ButtonGroup, IconButton, TextField } from '@mui/material';
import { AddIcon, DeleteIcon, RemoveIcon } from '@/core/components';
import soundClear from '/sound/button-21.mp3';
function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function ShoppingCart() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
 

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
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">
                  <ButtonGroup>
                    <Button
                      aria-label="reduce"

                    >
                      <RemoveIcon fontSize="small" />
                    </Button>
                    <TextField
                    value={1}
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
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
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
