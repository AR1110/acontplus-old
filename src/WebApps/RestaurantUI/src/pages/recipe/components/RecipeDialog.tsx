import React from "react";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Stack, TextField } from "@mui/material";

interface DialogComponentProps {
  open: boolean;
  onClose: () => void;
}

const RecipeDialog: React.FC<DialogComponentProps> = ({ open, onClose }) => {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("sm");

  return (
    <>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={onClose}
      >
        <DialogTitle sx={{ m: 0, p: 1 }}>Nueva Receta</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Nombre"
            id="outlined-size-small"
            fullWidth
            placeholder="..."
            size="small"
            margin="dense"
          />

          <TextField
            label="Descripcion"
            id="outlined-size-small"
            fullWidth
            placeholder="..."
            size="small"
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={1}>
            <Button size="medium" variant="contained">
              Guardar
            </Button>
            <Button size="medium" variant="outlined" onClick={onClose}>
              Cerrar
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { RecipeDialog };
