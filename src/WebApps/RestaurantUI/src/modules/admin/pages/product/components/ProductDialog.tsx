import { 
    Button,
    Card,
    CardActionArea,
    CardActions,  
    CardMedia,
    DialogActions,
    DialogContent,
    DialogTitle, 
    FormControlLabel,
 
    Grid,
    IconButton,
 
    MenuItem,
  
    Switch,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; 
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CategoryAutocomplete from "./CategoryAutocomplete";
import ImgProductDefault from '/assets/images/imgProductDefault.png';
import { ChangeEvent, useRef, useState } from "react";

import { useProductContext } from "../context";

import SalePriceListTabulator from "./SalePriceListTabulator";
import * as yup from "yup";
import {  Form, Formik} from "formik";


interface DialogProps {
    handleClose: ()=>void;
    dialogTitle: string;
}

export default function ProductDialog({handleClose, dialogTitle}: DialogProps) {

    // const [selectedFile, setSelectedFile] = useState(null);
    const { productState } = useProductContext();
    const dataFormApi = productState.dataFormApi;

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
 

    const handleUploadButtonClick = () => { 
        fileInputRef.current?.click();
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
          // Read the selected file as a data URL and set it as the image preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedImage(reader.result as string);
          };
          reader.readAsDataURL(selectedFile);
        }
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
        descripcion: yup.string().trim().lowercase("Hola").required("Descripción es requerido"),
        idSubFamilia: yup.number().required("Descripción es requerido"),
        idMedida: yup.number().required("La medida es requerida"),
        codigo: yup.string().trim().required("El código es requerido"),
        codigoBarra: yup.string().trim().required("El código de barra es requerido"),
        codigoAuxiliar: yup.string().trim().required("El código Auxiliar es requerido"),
        idTipoIva: yup.number().required("Tipo Iva es requerido"),
        precioCosto: yup.number()
                        .min(0, 'La cantidad no puede ser menor a cero')
                        .required("Campo precio costo es requerido es requrida")
                        .test("not-zero", "El valor mínimo en el precio de costo es 0.01", value => value !== 0),
    });
    


    // const formik = useFormik({
    //     initialValues: productState.data,
    //     validationSchema: validationSchema,
    //     onSubmit: (values) => {
    //         console.log(values);

    //     },
    // });

    const handleCancel = () => {
        // formik.resetForm();
        handleClose()
    };

    // const handleOk = () => {
    //     console.log('ok')
    // };

    const handleSubmit = (values:any, actions:any) => {
      
            // Simulate form submission
            alert(JSON.stringify(values, null, 2));
           actions.setSubmitting(false);
       
           
      };
      

    return (

        <Formik initialValues={productState.data} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {(formik) => (
                <Form> 
                    <DialogTitle sx={{ m: 0, p: 2 }}>
                    {dialogTitle}
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
                                    id="descripcion"
                                    name="descripcion" 
                                    value={formik.values.descripcion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.descripcion && Boolean(formik.errors.descripcion)
                                    }
                                    helperText={
                                        formik.touched.descripcion && formik.errors.descripcion
                                    } />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CategoryAutocomplete />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="idMedida"
                                    name="idMedida"
                                    select 
                                    label="Medida" 
                                    value={formik.values.idMedida > 0 ? formik.values.idMedida : ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}   
                                    error={
                                        formik.touched.idMedida && Boolean(formik.errors.idMedida)
                                    }
                                    helperText={
                                        formik.touched.idMedida && formik.errors.idMedida
                                    }                      
                                    >
                                    {dataFormApi.measures.map((option, index) => (
                                        <MenuItem key={index} value={option.idMedida}>
                                        {option.descripcion}
                                        </MenuItem>
                                    ))}
                                    </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                                <TextField  label="Código"  
                                            fullWidth 
                                            size="small"
                                            id="codigo"
                                            name="codigo" 
                                            value={formik.values.codigo}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.codigo && Boolean(formik.errors.codigo)
                                            }
                                            helperText={
                                                formik.touched.codigo && formik.errors.codigo
                                            }
                                        />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                                <TextField 
                                    label="Código Aux:" 
                                    fullWidth 
                                    size="small"
                                    id="codigoAuxiliar"
                                    name="codigoAuxiliar" 
                                    value={formik.values.codigoAuxiliar}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.codigoAuxiliar && Boolean(formik.errors.codigoAuxiliar)
                                    }
                                    helperText={
                                        formik.touched.codigoAuxiliar && formik.errors.codigoAuxiliar
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                                <TextField 
                                    label="Código Barrá" 
                                    fullWidth 
                                    size="small"
                                    id="codigoBarra"
                                    name="codigoBarra" 
                                    value={formik.values.codigoBarra}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.codigoBarra && Boolean(formik.errors.codigoBarra)
                                    }
                                    helperText={
                                        formik.touched.codigoBarra && formik.errors.codigoBarra
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                                <FormControlLabel 
                                    control={<Switch color="primary" size="small" />}
                                    label="Lleva Inventario" 
                                    id="llevaInventario"
                                    name="llevaInventario" 
                                    value={formik.values.llevaInventario}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}> 
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="idTipoIva"
                                    name="idTipoIva"
                                    select
                                    label="Tipo Iva" 
                                    value={formik.values.idTipoIva > 0 ? formik.values.idTipoIva : ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}                         
                                    >
                                    {dataFormApi.vatRates.map((option, index) => (
                                        <MenuItem key={index} value={option.idTipoIva}>
                                        {option.descripcion}
                                        </MenuItem>
                                    ))}
                                    </TextField> 
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
                                    } 
                                />
                            </Grid>
                            <Grid item lg={9} md={9} sm={12} xs={12}>
                                {/* Calculo tarifas  */}
                                <SalePriceListTabulator />
                            </Grid>
                            <Grid item lg={3} md={3} sm={12} xs={12}>
                            
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardActionArea  onClick={handleUploadButtonClick}>
                                        {selectedImage ? ( 
                                            <CardMedia
                                            component="img"
                                            height="140"
                                            image={selectedImage}
                                            alt="green iguana"
                                            />

                                        ) :  <CardMedia
                                            component="img"
                                            height="140"
                                            image={ImgProductDefault}
                                            alt="green iguana"
                                            /> 
                                        }
                                        
                                        <input
                                            type="file"
                                            style={{ display: 'none' }} // Oculta el input file
                                            ref={fileInputRef} // Asigna la referencia
                                            onChange={handleFileChange}
                                        />
                                    </CardActionArea>
                                    <CardActions>
                                        <IconButton aria-label="fingerprint" color="error">
                                            <RemoveCircleOutlineIcon/>
                                        </IconButton>
                                    </CardActions>
                                </Card> 
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" disabled={formik.isSubmitting}>Ok</Button>
                        <Button autoFocus onClick={handleCancel}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Form>
            )}
        </Formik> 
     
    );
}
