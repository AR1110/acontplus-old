import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material' ;
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"; 
 
import { useProductContext } from '../context';
import { useState } from 'react';

export default function ProductTable() { 
  const {productState} = useProductContext();
  const products = productState.products;
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  let enumeracion = 1;

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }; 

  return (
    <Paper
    sx={{ p: 2, display: "flex", flexDirection: "column" }}
    elevation={0}
  >

    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Table
        stickyHeader
        sx={{ minWidth: 650 }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>N°</TableCell>
            <TableCell>Código</TableCell>
            <TableCell align="center">Descripción</TableCell>
            <TableCell align="center">Tipo Artículo</TableCell>
            <TableCell align="center">Categoria</TableCell>
            <TableCell align="center">Stock</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>          
          {products.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <IconButton
                  aria-label="delete"
                  color="primary"
                  size="small"
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  color="error"
                  size="small"
                >
                  <RemoveCircleOutlineIcon fontSize="inherit" />
                </IconButton>
              </TableCell>
              <TableCell>{enumeracion++}</TableCell>
              <TableCell component="th" scope="row">
                {row.code}
              </TableCell>
              <TableCell align="center">{row.description}</TableCell>
              <TableCell align="center">{row.typeArticle}</TableCell>
              <TableCell align="center">{row.category}</TableCell>
              <TableCell align="center">{row.stock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[10, 25, 50, 100]}
      component="div"
      count={products.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    /> 
  </Paper>
  )
}
