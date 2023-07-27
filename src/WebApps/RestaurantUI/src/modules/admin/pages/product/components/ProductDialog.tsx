import {
    Avatar,
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions, 
    CardContent, 
    CardMedia,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BackupIcon from '@mui/icons-material/Backup';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CategoryAutocomplete from "./CategoryAutocomplete";
import ImgProductDefault from '/assets/images/imgProductDefault.png';
import { useRef, useState } from "react";

import { useProductContext } from "../context";

import SalePriceListTabulator from "./SalePriceListTabulator";
import * as yup from "yup";
import { useFormik } from "formik";


interface DialogProps {
    handleClose: ()=>void;
}

export default function ProductDialog({handleClose}: DialogProps) {

    const [selectedFile, setSelectedFile] = useState(null);
    const { productState } = useProductContext();
    const dataFormApi = productState.dataFormApi;

    const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };



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

    const validationSchema = yup.object({ 
        descripcion: yup.string().trim().required("Descripción es requerido"),
        idMedida: yup.number().required("La medida es requerida"),
        precioCosto: yup
            .number()
            // .min(1, "El valor mínimo en el precio de costo es 0.01")
            .required("Campo precio costo es requerido es requrida")
            .test("not-zero", "El valor mínimo en el precio de costo es 0.01", value => value !== 0),
    });


    const formik = useFormik({
        initialValues: {
            description: '',
            idMedida: 0,
            precioCosto: 0
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values);

        },
    });

    const handleCancel = () => {
        formik.resetForm();
        handleClose()
    };

    const handleOk = () => {
        console.log('ok')
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Productos
                <IconButton
                    aria-label="close"
                    onClick={handleCancel}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField 
                            label="Descripción" 
                            fullWidth 
                            size="small" 
                            id="description"
                            name="description" 
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.description && Boolean(formik.errors.description)
                            }
                            helperText={
                                formik.touched.description && formik.errors.description
                            } />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CategoryAutocomplete />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Medida</InputLabel>
                            <Select  
                            name="idMedida"
                            id="idMedida"
                            label="Medida"  
                            value={formik.values.idMedida}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.idMedida && Boolean(formik.errors.idMedida)
                            } >
                                <MenuItem value={0} disabled>Seleccione la Medida</MenuItem>
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
                    <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                        <TextField type="number"
                            label="Precio Costo" 
                            fullWidth 
                            size="small" 
                            id="precioCosto"
                            name="precioCosto" 
                            value={formik.values.precioCosto}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.precioCosto && Boolean(formik.errors.precioCosto)
                            }
                            helperText={
                                formik.touched.precioCosto && formik.errors.precioCosto
                            } />
                    </Grid>
                    <Grid item lg={9} md={9} sm={12} xs={12}>
                        <SalePriceListTabulator />
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                     
                        <Card sx={{ maxWidth: 345 }}>
                            <CardActionArea  onClick={handleUploadButtonClick}>
                                <CardMedia
                                component="img"
                                height="140"
                                image={ImgProductDefault}
                                alt="green iguana"
                                /> 
                            </CardActionArea>
                            <CardActions>
                                <IconButton aria-label="fingerprint" color="error">
                                    <RemoveCircleOutlineIcon/>
                                </IconButton>
                            </CardActions>
                        </Card>
                   
                                    {/* <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                sx={{ height: 140 }}
                                image="/static/images/cards/contemplative-reptile.jpg"
                                title="green iguana"
                            />

                            <CardActions>
                                <input type="file"   />
                                <Button
                                    size="small"
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    
                                >
                                    Subir imagen
                                </Button>
                            </CardActions>
                        </Card> */}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleOk}>Ok</Button>
            </DialogActions>


        </form>
    );
}
