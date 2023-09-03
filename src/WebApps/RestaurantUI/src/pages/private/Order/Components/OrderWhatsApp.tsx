import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, useTheme } from "@mui/material";

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

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title">
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
                <Button autoFocus onClick={handleClose}>
                    Cerrar
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    style={{ height: 60 }}
                    onClick={handleClose}
                    autoFocus
                >
                    Enviar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
