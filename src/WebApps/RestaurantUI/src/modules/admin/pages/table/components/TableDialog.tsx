import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
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
    roomId: yup.number().default(1).min(1, 'No puede ser cero').required('Campo piso es requerido'),
    numberTable: yup.number().default(1).min(1, 'Numero de Mesa es obligatorio').required('Numero de Mesa es requerido'),
    description: yup.string().trim().required('Este campo es requerido'),
    capacity: yup.number().default(1).min(1, "La capacidad debe ser mayor o igual a 1").required('Ingrese campo capacidad') 
  });
  const rooms = [
    { roomId: 1, description: 'Piso 1'}
  ]
  const formik = useFormik({
    initialValues: {
      id: 0,
      roomId: 1,
      numberTable: 1,
      description: '',
      capacity: 1,
      enabled: true, 
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        
        // const formData = new FormData(); 
        // formData.append("file", selectedImage as Blob, selectedImage?.name); 
        // const data = {
        //   DataFile: formData,
        //   Params: JSON.stringify(values)
        // }
        // await CategorySvc.imageUpload(data).then(response => { 
        //   console.log(response);
        // }) 
        // }) 
        console.log(values)
        if(values.id>0){
          await CategorySvc.update(values.id, values).then(response => {
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
    if (!formik.values.description) return ;
    if(formik.values.id > 0) return; 
    formik.setFieldValue("siglas", formik.values.description.toUpperCase())
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
        {`${formik.values.id > 0 ? 'Editar' : 'Nuevo'} Mesa`}
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
            size="small"
            id="roomId"
            name="roomId"
            select 
            label="Piso" 
            value={formik.values.roomId > 0 ? formik.values.roomId : ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}   
            error={
                formik.touched.roomId && Boolean(formik.errors.roomId)
            }
            helperText={
                formik.touched.roomId && formik.errors.roomId
            }                      
            >
            {rooms.map((option, index) => (
                <MenuItem key={index} value={option.roomId}>
                {option.description}
                </MenuItem>
            ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <TextField
              fullWidth
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              
              id="description"
              label="Descripción"
              name="description"
              onBlur={formik.handleBlur}
              onChange={(e)=>{
                formik.handleChange(e)
                handleToUpperCase();
              }}
              size="small"
              value={formik.values.description}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <TextField
              type='number'
              error={formik.touched.numberTable && Boolean(formik.errors.numberTable)}
              fullWidth
              helperText={formik.touched.numberTable && formik.errors.numberTable}
              id="numberTable"
              label="Número Mesa"
              name="numberTable"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              size="small"
              value={formik.values.numberTable}
              variant="outlined"
            />
          </Grid> 

          <Grid item xs={12} sm={12} md={12}>
            <TextField
              type='number'
              error={formik.touched.capacity && Boolean(formik.errors.capacity)}
              fullWidth
              helperText={formik.touched.capacity && formik.errors.capacity}
              id="capacity"
              label="Capacidad"
              name="capacity"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              size="small"
              value={formik.values.capacity}
              variant="outlined"
            />
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
