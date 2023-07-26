import {
  Button,
  Card,
  CardActions,
  CardMedia,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import CategoryAutocomplete from "./CategoryAutocomplete";
import { ReactTabulator } from "react-tabulator/lib";
import { useState } from "react";
import { Http } from "@/core/utils";
import { PATHS } from "@/core/constants/path";
export default function ProductDialog() {
  const [selectedFile, setSelectedFile] = useState(null);
  const currencies = [
    {
      value: "USD",
      label: "$",
    },
    {
      value: "EUR",
      label: "€",
    },
    {
      value: "BTC",
      label: "฿",
    },
    {
      value: "JPY",
      label: "¥",
    },
    {
      value: "JPY",
      label: "¥",
    },
    {
      value: "JPY",
      label: "¥",
    },
    {
      value: "JPY",
      label: "¥",
    },
    {
      value: "JPY",
      label: "¥",
    },
    {
      value: "JPY",
      label: "¥",
    },
    {
      value: "JPY",
      label: "¥",
    },
    {
      value: "JPY",
      label: "¥",
    },
    {
      value: "JPY",
      label: "¥",
    },
    {
      value: "JPY",
      label: "¥",
    },
    {
      value: "JPY",
      label: "¥",
    },
  ];

  const columns = [
    { title: "Tarifa", field: "tarifa", width: 150, editor: "input" },
    { title: "Tipo Iva", field: "tipoIva", hozAlign: "left" },
    { title: "Precio Venta", field: "precioVenta" },
    { title: "Precio con IVA", field: "precioConIva", hozAlign: "center" },
    { title: "% Utilidad", field: "porcentajeUtilidad", hozAlign: "center" },
    { title: "Utilidad", field: "utilidad", hozAlign: "center" },
    { title: "Estado", field: "estado", hozAlign: "center" },
  ];
  const data = [
    {
      id: 3,
      tarifa: "Christine Lobowski",
      tipoIva: "12",
      precioVenta: "green",
      precioConIva: "22/05/1982",
      porcentajeUtilidad: "",
      utlidad: "",
      estado: "",
    },
    {
      id: 3,
      tarifa: "Christine Lobowski",
      tipoIva: "12",
      precioVenta: "green",
      precioConIva: "22/05/1982",
      porcentajeUtilidad: "",
      utlidad: "",
      estado: "",
    },
    {
      id: 3,
      tarifa: "Christine Lobowski",
      tipoIva: "12",
      precioVenta: "green",
      precioConIva: "22/05/1982",
      porcentajeUtilidad: "",
      utlidad: "",
      estado: "",
    },
  ];

  const uploadImage = function (event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]!);
    }
  };

  const saveImage = function () {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("myFile", selectedFile, selectedFile.name);

    // Details of the uploaded file
    console.log(selectedFile);
    Http({
      method: "post",
      url: PATHS.INVENTARIO + "v3/Articulo/Upload",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => {
      console.log(response);
    });
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <TextField label="Descripción" fullWidth size="small" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CategoryAutocomplete />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Medida</InputLabel>
            <Select value="" label="Age">
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <TextField label="Código" fullWidth size="small" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <TextField label="Código Aux:" fullWidth size="small" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <TextField label="Código Barrá" fullWidth size="small" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <FormControlLabel
            value="top"
            control={<Switch color="primary" size="small" />}
            label="Lleva Inventario"
            labelPlacement="top"
          />
        </Grid>

        <Grid item xs={8} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <ReactTabulator
            responsiveLayout={true}
            autoResize={true}
            data={data}
            columns={columns}
            layout={"fitData"}
          />
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 140 }}
              image="/static/images/cards/contemplative-reptile.jpg"
              title="green iguana"
            />

            <CardActions>
              <input type="file" onChange={uploadImage} />
              <Button
                size="small"
                fullWidth
                variant="contained"
                color="success"
                onClick={saveImage}
              >
                Subir imagen
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
