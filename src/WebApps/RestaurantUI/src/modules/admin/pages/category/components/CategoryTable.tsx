import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'; 

import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { CategoryReadDto } from '@/modules/admin/models';

type CategoryTableProp = {
  categories: CategoryReadDto[]
}

export default function CategoryTable({categories}:CategoryTableProp) { 
  return (
    <Paper
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
      elevation={0}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>N°</TableCell>
              <TableCell >DESCRIPCIÓN</TableCell>
              <TableCell align="center">SIGLAS</TableCell>
              <TableCell align="center">CÓDIGO</TableCell>
              <TableCell align="center">SECUENCIAL</TableCell>
              <TableCell align="center">MONTO OBJETIVO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <IconButton aria-label="delete" color="primary" size="small">
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton aria-label="delete" color="error" size="small">
                    <RemoveCircleOutlineIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{category.descripcion}</TableCell>
                <TableCell align="center">{category.siglas}</TableCell>
                <TableCell align="center">{category.codigo}</TableCell>
                <TableCell align="center">{category.siglas}</TableCell>
                <TableCell align="center">{category.montoObjetivo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
