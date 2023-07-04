import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Avatar, Grid, IconButton, Typography } from "@mui/material";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread 1", 356, 16.0, 49, 3.9),
  createData("Gingerbread 2", 356, 16.0, 49, 3.9),
  createData("Gingerbread 3", 356, 16.0, 49, 3.9),
  createData("Gingerbread 4", 356, 16.0, 49, 3.9),
  createData("Gingerbread 5", 356, 16.0, 49, 3.9),
  createData("Gingerbread 6", 356, 16.0, 49, 3.9),
];

export default function ProductSelected() {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 250 }}>
      <Table stickyHeader size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell align="right">Cant.</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Op.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hamburger_%28black_bg%29.jpg/800px-Hamburger_%28black_bg%29.jpg"
                      alt="Test"
                    />
                  </Grid>
                  <Grid item xs>
                    <div>{row.name}</div>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      $ 10
                    </Typography>
                  </Grid>
                </Grid>
              </TableCell>
              <TableCell align="center">
                {/* <TextField
                  hiddenLabel
                  id="outlined-size-small"
                  size="small"
                  placeholder="Cant."
                  style={{ width: 120, textAlign: "center" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton aria-label="Menos" edge="end" color="error">
                          <i className="mdi mdi-minus-circle"></i>
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="Mas" edge="end" color="success">
                          <i className="mdi mdi-plus-circle"></i>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                /> */}
                1
                {/* <div className="input-group">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    type="button"
                    id="button-addon1"
                  >
                    <i className="mdi mdi-minus-circle"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control form-control-sm text-center"
                    placeholder=""
                    aria-label="Example text with button addon"
                    aria-describedby="button-addon1"
                  />
                  <button
                    className="btn btn-outline-success btn-sm"
                    type="button"
                    id="button-addon2"
                  >
                    <i className="mdi mdi-plus-circle"></i>
                  </button>
                </div> */}
              </TableCell>
              <TableCell>$ 10</TableCell>
              <TableCell align="right">
                <IconButton size="small" color="error">
                  <i className="fas fa-trash"></i>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
