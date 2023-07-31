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
  });

  

  const formik = useFormik({
    initialValues: {
      idFamilia: 0,
      descripcion: '',
      siglas: '',
      montoObjetivo: 0.0,
      applicationId: 1,
      imagUrl: '', 
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      try {
        console.log(values)
          //     // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append("image", selectedImage as Blob, selectedImage?.name);

        // Details of the uploaded file
        CategorySvc.imageUpload(formData).then(response=>{
          console.log(response);
        })
        // CategorySvc.post(values).then((response) => {
        //   if (response){
        //     console.log(response);
        //   }
        // });
      } catch (error) {
        console.log(error);
      }
    },
  });



  const handleCancel = () => {
    formik.resetForm();
    handleClose();
  }; 

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogTitle id="alert-dialog-title">
        {'Categoría'}
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
              error={
                formik.touched.descripcion && Boolean(formik.errors.descripcion)
              }
              fullWidth
              helperText={
                formik.touched.descripcion && formik.errors.descripcion
              }
              id="descripcion"
              label="SubFamilia"
              name="descripcion"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
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
              onChange={formik.handleChange}
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
              variant="outlined"
            />
          </Grid>

          <Grid item lg={3} md={3} sm={12} xs={12}>
            <ImageUpload onChangeImage={setSelectedImage}/>
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
        <Button variant="contained" type="submit">
          Guardar
        </Button>
        <Button variant="outlined">Cerrar</Button>
      </DialogActions>
    </form>
  );
}
