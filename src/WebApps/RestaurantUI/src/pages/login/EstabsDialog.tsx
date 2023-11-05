

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef } from 'react';
import { Button, DialogActions, Slide, Typography } from '@mui/material';
import { Establecimiento, PrivateRoutes } from '@/core/models';
import { authService, setEstabs, setToken, setUserData } from '@/core/services';
import { SnackbarUtility } from '@/core/utilities';
import { hideLoader, showLoader } from '@/spinner';
import { useNavigate } from 'react-router-dom';

interface EstabsDialogProps {
    open: boolean;
    params: any
    selectedValue: any;
    onClose(value: any): void;
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const EstabsDialog = (props: EstabsDialogProps) => {
    const { onClose, selectedValue, open, params } = props;
    const navigate = useNavigate();
    const establecimientos: Array<Establecimiento> = params.flatMap((userRole: any) => userRole.establecimientos) 

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value: any) => {
        const userData = params.find((pp: any) => pp.companyId === value.idEntidad)

        if (userData) {
            const establecimientos = params.flatMap((userRole: any) => userRole.establecimientos)
            const dataEstab = establecimientos.find((estab: Establecimiento) => estab.codEstab === value.codEstab);
            userData.bussinesName = dataEstab.nombreComercial;
            showLoader();
            authService.createToken(userData)
                .then(response => {
                    if (response.code === "0" || response.id === "0") {
                        SnackbarUtility.warning(response.message);
                    }
                    if (response.code === "1") {
                        SnackbarUtility.success("Inciando Sessión");
                        const dataLogin = JSON.parse(response.payload); 
                        setToken(dataLogin.token)
                        setUserData(dataLogin);
                        setEstabs([dataEstab]);
                        navigate(`/${PrivateRoutes.PRIVATE}`, { replace: true });
                    }
                })
                .finally(() => hideLoader())
        } else {
            SnackbarUtility.error('')
        }
    };

    const buttonSx = {
        bgcolor: "#212121",
        '&:hover': {
            bgcolor: "#424242",
        },
    };

    return (
        <Dialog open={open} TransitionComponent={Transition}>
            <DialogTitle>Establecimientos: </DialogTitle>
            <List>
                {establecimientos.map((estab, index) => (
                    <ListItem disableGutters key={index}>
                        <ListItemButton onClick={() => handleListItemClick(estab)}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={estab.nombreComercial} secondary={
                                <>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {estab.ruc}
                                    </Typography>
                                    {` — ${estab.entidad}`}
                                </>
                            } />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <DialogActions>
                <Button onClick={handleClose} size='large' sx={buttonSx} fullWidth variant='contained'>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EstabsDialog
