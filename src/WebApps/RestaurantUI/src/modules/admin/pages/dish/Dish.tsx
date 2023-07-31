import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";
import SearchComponent from "./components/Search";
import { useEffect } from "react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function DishComponent() {
  useEffect(() => {
    //getDishes();
  }, []);

  // Set data.
  //const [productData, setProductData] = useState<IProduct[] | []>([]);

  // Create methods for get, post, put, delete
//   const getDishes = () => {
//     try {
//       productController.getAll().then((response) => {
//         if (response.code === "0") {
//           console.log(response);
//         }
//         if (response.code === "1") {
//           const decode = JSON.parse(response.payload);
//           const setProduct = mapFomApiToProducts(decode[0]);
//           setProductData(setProduct);
//         }
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const mapFomApiToProducts = (
//     apiResponse: ProductResponseFromApi
//   ): Array<IProduct> => {
//     return apiResponse.map((product) => ({
//       code_unique: product.code_unique,
//       codigo: product.codigo,
//       description: product.descripcion,
//       estado: product.estado,
//       idArticulo: product.idArticulo,
//       idMedida: product.idMedida,
//       imagen: product.imagen,
//       marca: product.marca,
//       medida: product.medida,
//       modelo: product.modelo,
//       observation: product.observaciones,
//       precioCosto: product.precioCosto,
//       precioSinSubsidio: product.precioSinSubsidio,
//       stock: product.stock,
//       stockMinimo: product.stockMinimo,
//       style: product.style,
//       subFamilia: product.subFamilia,
//       tipoArticulo: product.tipoArticulo,
//       tipoIva: product.tipoIva,
//       totalRecords: product.totalRecords,
//     }));
//   };

  return (
    <>
      <Grid item xs={12} md={12} sm={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={2}>
              <h1>Platos</h1>
            </Grid>
            <Grid item xs={6} md={4}>
              <SearchComponent></SearchComponent>
            </Grid>
            <Grid item xs={6} md={2}>
              <Item>xs=6 md=4</Item>
            </Grid>
            <Grid item xs={6} md={2}>
              <Item>xs=6 md=4</Item>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
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
        </Paper>
      </Grid>
    </>
  );
}
