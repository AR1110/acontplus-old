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

import { ChangeEvent, useEffect, useState } from "react";
import { Http } from "@/core/utils";
import { PATHS } from "@/core/constants/path";
import { useProductContext } from "../context";
import { SalePriceList } from "@/modules/admin/models";
import SalePriceListTabulator from "./SalePriceListTabulator";
export default function ProductDialog() { 

  const [selectedFile, setSelectedFile] = useState(null);
  const {productState} = useProductContext();
  const dataFormApi = productState.dataFormApi;  

   

//   const uploadImage = function (event: ChangeEvent<HTMLInputElement>) {
//     if (event.target.files) {
//       setSelectedFile(event.target.files[0]!);
//     }
//   };

//   const saveImage = function () {
//     // Create an object of formData
//     const formData = new FormData();

//     // Update the formData object
//     formData.append("myFile", selectedFile, selectedFile.name);

//     // Details of the uploaded file
//     console.log(selectedFile);
//     Http({
//       method: "post",
//       url: PATHS.INVENTARIO + "v3/Articulo/Upload",
//       data: formData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }).then((response) => {
//       console.log(response);
//     });
//   };
  

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
				<Select value="" label="Medida">
				{dataFormApi.measures.map((item, key) => (
					<MenuItem key={key} value={item.idMedida}>{item.descripcion}</MenuItem>
				))}
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

        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
			<FormControl fullWidth size="small">
				<InputLabel>Tipo Iva</InputLabel>
				<Select value="" label="Medida">
				{dataFormApi.vatRates.map((item, key) => (
					<MenuItem key={key} value={item.idTipoIva}>{item.descripcion}</MenuItem>
				))}
				</Select>
			</FormControl>
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
        <Grid item lg={9} md={9} sm={12} xs={12}>
          <SalePriceListTabulator/>
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 140 }}
              image="/static/images/cards/contemplative-reptile.jpg"
              title="green iguana"
            />

            <CardActions>
              {/* <input type="file" onChange={uploadImage} />
              <Button
                size="small"
                fullWidth
                variant="contained"
                color="success"
                onClick={saveImage}
              >
                Subir imagen
              </Button> */}
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
