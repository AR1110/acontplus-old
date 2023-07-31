import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import * as yup from 'yup';
import { useFormik } from 'formik';
import { useRef, useState } from 'react';
import { CategorySvc } from '@/modules/admin/services';
import { ImageUpload } from '@/core/components'; 
interface ModalProps {
  handleClose: () => void;
}

export default function CategoryDialog({ handleClose }: ModalProps) {

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const validationSchema = yup.object({
    descripcion: yup.string().trim().required('Descripción es requerido'),
    siglas: yup.string().required('Siglas es requerido'),
    montoObjetivo: yup.number().min(0, 'No puede ser vacio').required('Este campo es requerido'),
    //file: yup.mixed().required("Required file")
  });

  const formik = useFormik({
    initialValues: {
      idFamilia: 0,
      idSubFamilia: 0,
      descripcion: '',
      siglas: '',
      montoObjetivo: 0.0,
      applicationId: 1, 
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log(selectedImage)
        console.log(values)
        //     // Create an object of formData
        const formData = new FormData();
        
        // Update the formData object
        //formData.append("image", selectedImage as Blob, selectedImage?.name);
        formData.append("image", selectedImage as Blob, selectedImage?.name);
    


       // formik.setFieldValue("file", values.file);

        // Details of the uploaded file
        await CategorySvc.imageUpload(formData).then(response => { 
          console.log(response);
        })
        // console.log(selectedImage)
        // console.log(formik.values)
        // await CategorySvc.post(values).then((response) => {
        //   console.log(response);  
        // }) 
      } catch (error) { 
        console.log(error);
      }finally{
        formik.setSubmitting(false);
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    handleClose();
  };

  const handleToUpperCase = function () {
    if (!formik.values.descripcion) return null;

  
    formik.setFieldValue("siglas", formik.values.descripcion.slice(0,3).toUpperCase())
  }

  const handleChangeImage = function (file: File | null){
    formik.setFieldValue("file", file );
  }


  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogTitle id="alert-dialog-title">
        {`${formik.values.idSubFamilia > 0 ? 'Editar' : 'Nuevo'} Categoria`}
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{
            position: 'absolute',
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
              fullWidth
              error={
                formik.touched.descripcion && Boolean(formik.errors.descripcion)
              }
              helperText={
                formik.touched.descripcion && formik.errors.descripcion
              }
              id="descripcion"
              label="SubFamilia"
              name="descripcion"
              onBlur={formik.handleBlur}
              onChange={(e)=>{
                formik.handleChange(e)
                handleToUpperCase();
              }}
              size="medium"
              value={formik.values.descripcion}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              error={formik.touched.siglas && Boolean(formik.errors.siglas)}
              fullWidth
              helperText={formik.touched.siglas && formik.errors.siglas}
              id="siglas"
              label="Siglas"
              name="siglas"
              onBlur={formik.handleBlur}
              onChange={e=>{
                formik.handleChange(e); 
                formik.setFieldValue("siglas", e.target.value.toUpperCase());
              }}
              size="medium"
              value={formik.values.siglas}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              id="montoObjetivo"
              label="Monto objetivo"
              name="montoObjetivo"
              size="medium"
              type="number"
              value={formik.values.montoObjetivo}
              error={
                formik.touched.montoObjetivo && Boolean(formik.errors.montoObjetivo)
              }
              helperText={
                formik.touched.montoObjetivo && formik.errors.montoObjetivo
              }
              variant="outlined"
            />
          </Grid>

          <Grid item lg={3} md={3} sm={12} xs={12}>
            <ImageUpload onChangeImage={setSelectedImage} />
            {/* <Card sx={{ maxWidth: 345 }}>
              <CardActionArea onClick={handleUploadButtonClick}>
                <CardMedia
                  component="img"
                  height="140"
                  image={ImgProductDefault}
                  alt="green iguana"
                />
              </CardActionArea>
              <input
                type="file"
                name="image"
                id="image"
                ref={fileInputRef}
                onChange={handleUploadButtonClick}
              />
              <CardActions>
                <IconButton aria-label="fingerprint" color="error">
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </CardActions>
            </Card> */}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button variant="outlined" onClick={handleCancel} disabled={formik.isSubmitting}>Cerrar</Button>
      </DialogActions>
    </form>
  );
}
