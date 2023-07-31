import {
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchComponent from './components/Search';
import { ProductReadDto } from '../../models';

export default function DishComponent() {
  const [dishes, setDishes] = useState<Array<ProductReadDto>>([]);

  useEffect(() => {
    getDishes();
  }, []);

  const getDishes = () => {
    try {
         
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid item xs={12}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="h4" gutterBottom>
          Platillos
        </Typography>
        <Button variant="contained" size="large" startIcon={<AddIcon />}>
          Agregar
        </Button>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <SearchComponent></SearchComponent>
        </Grid>
      </Grid>
      <TableContainer sx={{ mt: 2 }} component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Descripción (100g serving)</TableCell>
              <TableCell align="right">Categoría</TableCell>
              <TableCell align="right">Total peso&nbsp;(g)</TableCell>
              <TableCell align="right">Costo&nbsp;(g)</TableCell>
              <TableCell align="right">Precio&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {productData.map((row) => (
                  <TableRow
                    key={row.description}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.description}
                    </TableCell>
                    <TableCell align="right">{row.subFamilia}</TableCell>
                    <TableCell align="right">{row.stock}</TableCell>
                    <TableCell align="right">{row.precioCosto}</TableCell>
                    <TableCell align="right">{row.precioSinSubsidio}</TableCell>
                  </TableRow>
                ))} */}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
