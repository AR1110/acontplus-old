
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { ReactElement, ReactNode, forwardRef } from 'react';
import { DialogContent, Stack } from '@mui/material';

interface FullScreenDialogProps {
    color?: 'default' | 'inherit' | 'primary' | 'secondary' | 'transparent'
    icon?: JSX.Element;
    dialogTitle?: string
    isOpen: boolean
    handleClose<T>(value?:T): void
    children: ReactNode
    actions?: ReactNode
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function FullScreenDialog({
    color = "primary",
    icon,
    dialogTitle,
    isOpen,
    handleClose,
    children,
    actions
}: FullScreenDialogProps) {
    return (
        <Dialog
            fullScreen
            open={isOpen}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }} color={color}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        {icon}
                    </IconButton>
                    <Typography sx={{ ml: 1, flex: 1 }} variant="subtitle1" component="div">
                        {dialogTitle}
                    </Typography>
                    <Stack spacing={0} direction="row">
                        {actions}
                    </Stack>
                </Toolbar>
            </AppBar>
            <DialogContent sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: "100vh",
                overflow: "auto",
                p: 3
            }}>
                {children}
            </DialogContent>

        </Dialog>

    );
}
