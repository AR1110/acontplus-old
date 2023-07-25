import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { red } from "@mui/material/colors";
import { IProductView } from "@admin/models";
import { useEffect, useState } from "react";
import { ProductSvc } from "@admin/services";

interface ProductState {
  products: IProductView[];
  page: number;
  rowsPerPage: number;
}

export default function ProductPage() {
  let enumeracion = 1;
  const [products, setProducts] = useState<ProductState["products"]>([]);
  const [page, setPage] = useState<ProductState["page"]>(0);
  const [rowsPerPage, setRowsPerPage] =
    useState<ProductState["rowsPerPage"]>(10);
  const getProducts = () => {
    try {
      console.log(ProductSvc);
      ProductSvc.getAll().then((response) => {
        setProducts(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Grid item xs={12}>
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
      </Grid>
    </>
  );
}
