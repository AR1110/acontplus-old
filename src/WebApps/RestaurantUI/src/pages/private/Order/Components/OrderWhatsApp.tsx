import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export interface OrderDialogWhatsApp {
  open: boolean;
  onClose: (value: boolean) => void;
}

export default function ResponsiveDialog(props: OrderDialogWhatsApp) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { onClose, open } = props;

  const handleClose = () => {
    onClose(false);
  };

  const getInstanceStatus = () => {
    console.log("Here getInstanceStatus");
  }

  const connectGreenApi = () => {
    console.log('Green api');
  }

  const getQrCode = () => {
    console.log('Get Qr Code');
  }

  const sendSms = () => {
    console.log("Send sms");
  }

  const sendMedia = () => {
    console.log("Send media");
  }

  const generateXML = () => {
    console.log("Generate XML");
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Enviar mensajes por WhatsApp"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          size="large"
          color="success"
          onClick={handleClose}
          autoFocus
        >
          Enviar
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          size="large"
          autoFocus
          onClick={handleClose}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
