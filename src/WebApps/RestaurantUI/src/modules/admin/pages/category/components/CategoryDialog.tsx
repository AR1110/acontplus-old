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
import { useEffect, useState } from 'react';
import { CategorySvc } from '@/modules/admin/services';
import { ImageUpload, dialogCloseSubject$ } from '@/core/components'; 
import { SubjectManager } from '@/core/models';
import { Subscription } from 'rxjs';
import { SnackbarUtilities } from '@/core/utils';
interface ModalProps {
  callBackCloseDialog: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const dialogDataSubject$ = new SubjectManager<any>();

export default function CategoryDialog({ callBackCloseDialog }: ModalProps) {

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
        
         const formData = new FormData(); 
        formData.append("file", selectedImage as Blob, selectedImage?.name); 
        // const data = {
        //   DataFile: formData,
        //   Params: JSON.stringify(values)
        // }
        // await CategorySvc.imageUpload(data).then(response => { 
        //   console.log(response);
        // }) 
        // }) 
        console.log(values)
        if(values.idSubFamilia>0){
          await CategorySvc.update(values.idSubFamilia, values).then(response => {
            if(response.code==="0"){
              SnackbarUtilities.warning(response.message);
            }
            if(response.code==="1"){
              SnackbarUtilities.success(response.message);              
              handleCancel();
              callBackCloseDialog();
            } 
          })
        }

      } catch (error) { 
        console.log(error);
      }finally{
        formik.setSubmitting(false);
      }
    },
  });

  const handleCancel = () => {
    dialogCloseSubject$.setSubject = false;
    formik.resetForm(); 
  };

  const handleToUpperCase = function () {
    if (!formik.values.descripcion) return ;
    if(formik.values.idSubFamilia > 0) return; 
    formik.setFieldValue("siglas", formik.values.descripcion.slice(0,3).toUpperCase())
  } 

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let dataSubject$ = new Subscription();

  useEffect(()=>{
    console.log('load component category')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dataSubject$ = dialogDataSubject$.getSubject.subscribe((data) => {
      console.log(data)
      formik.setValues(data)
    });
    return ()=>{ 
      dataSubject$.unsubscribe();
    }
  }, [])


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

          <Grid item lg={5} md={6} sm={12} xs={12}>
            <ImageUpload onChangeImage={setSelectedImage} /> 
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
