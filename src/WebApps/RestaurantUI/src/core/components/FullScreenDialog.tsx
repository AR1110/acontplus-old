
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
    icon?: JSX.Element;
    dialogTitle: string
    isOpen: boolean
    handleClose(): void
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



export default function FullScreenDialog({ icon, dialogTitle, isOpen, handleClose, children, actions }: FullScreenDialogProps) {
    return (
        <Dialog
            fullScreen
            open={isOpen}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
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
            <DialogContent>
                {children}
            </DialogContent>

        </Dialog>

    );
}
