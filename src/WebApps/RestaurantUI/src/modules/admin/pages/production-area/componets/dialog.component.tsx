import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { dialogCloseSubject$ } from '@/core/components';
import { Subscription } from 'rxjs';
import { useEffect } from 'react';
import { dialogDataSubject$ } from '../../table/components/TableDialog';
import CloseIcon from '@mui/icons-material/Close';
import { ProductionAreaSvc } from '@/modules/admin/services/production-area.service';
import { SnackbarUtilities as Snackbar } from '@/core/utils';

interface Props {
  callBackCloseDialog: () => void;
}

export default function DialogComponent({ callBackCloseDialog }: Props) {
  const validationSchema = yup.object({
    code: yup.string().trim().required('Código es requerido'),
    description: yup.string().trim().required('Descripción es requerido'),
  });

  const formik = useFormik({
    initialValues: {
      id: 0,
      code: '',
      description: '',
      enabled: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (formik.values.id > 0) {
          await ProductionAreaSvc.update(values.id, values).then((response) => {
            callBackCloseDialog();
            Snackbar.success('Actualizado correctamente');
            handleCancel();
          });
        } else {
          await ProductionAreaSvc.post(values).then((response) => {
            callBackCloseDialog();
            Snackbar.success('Ingresado correctamente');
            handleCancel();
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  const handleCancel = () => {
    dialogCloseSubject$.setSubject = false;
    formik.resetForm();
  };

  const handleToUpperCase = function () {
    if (!formik.values.description) return;
    if (formik.values.id > 0) return;
    formik.setFieldValue(
      'code',
      formik.values.description.slice(0, 2).toUpperCase()
    );
  };

  let dataSubject$ = new Subscription();

  useEffect(() => {
    console.log('load component category');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dataSubject$ = dialogDataSubject$.getSubject.subscribe((data) => {
      formik.setValues(data);
    });
    return () => {
      dataSubject$.unsubscribe();
    };
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogTitle id="alert-dialog-title">
        {formik.values.id > 0 ? 'Editar' : 'Agregar'} Área de producción
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
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              id="description"
              label="Descripción"
              name="description"
              onBlur={formik.handleBlur}
              onChange={(e) => {
                formik.handleChange(e);
                handleToUpperCase();
              }}
              size="medium"
              value={formik.values.description}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              error={formik.touched.code && Boolean(formik.errors.code)}
              fullWidth
              helperText={formik.touched.code && formik.errors.code}
              id="code"
              label="Código"
              name="code"
              onBlur={formik.handleBlur}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldValue('code', e.target.value.toUpperCase());
              }}
              size="medium"
              value={formik.values.code}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          type="submit"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={formik.isSubmitting}
        >
          Cerrar
        </Button>
      </DialogActions>
    </form>
  );
}
