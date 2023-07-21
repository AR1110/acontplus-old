import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { ITable } from "../../models/table.model";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": { width: "50%", maxHeight: 435 },
  maxWidth: "xs",
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
interface TableDialogProps {
  isOpenDialog: boolean;
  handleClose: () => void;
  handleConfirmSave: () => void;
  values: Partial<ITable>;
}

export default function TableDialog({
  isOpenDialog,
  handleClose,
  handleConfirmSave,
  values,
}: TableDialogProps) {
  const closeDialog = () => {
    formik.resetForm();
    handleClose();
  };
  const validationSchema = yup.object({
    numberTable: yup.number().required("Numero de mesa es requerido"),
    description: yup.string().required("Descripción es requerido"),
    capacity: yup
      .number()
      .min(1, "Numero de capacidad de la mesa al menos tiene que ser 1")
      .required("Campo capacidad es requrida"),
  });
  console.log(values);

  const formik = useFormik({
    initialValues: values,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      handleConfirmSave();
    },
  });
  formik.initialValues = values;
  formik.values = values;
  return (
    <div>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={isOpenDialog}
      >
        <form onSubmit={formik.handleSubmit}>
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={closeDialog}
          >
            Nueva Mesa
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              name="numberTable"
              id="numberTable"
              select
              label="Número de mesa"
              value={formik.values.numberTable}
              onChange={formik.handleChange}
              error={
                formik.touched.numberTable && Boolean(formik.errors.numberTable)
              }
              helperText={
                formik.touched.numberTable && formik.errors.numberTable
              }
              size="small"
              margin="normal"
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
            </TextField>

            <TextField
              fullWidth
              id="description"
              name="description"
              label="Descripción"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              margin="normal"
              size="small"
            />
            <TextField
              type="number"
              fullWidth
              id="capacity"
              name="capacity"
              label="Capacidad"
              value={formik.values.capacity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.capacity && Boolean(formik.errors.capacity)}
              helperText={formik.touched.capacity && formik.errors.capacity}
              margin="normal"
              size="small"
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" type="submit">
              Guardar
            </Button>
            <Button variant="outlined" onClick={closeDialog}>
              Cerrar
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </div>
  );
}
