import * as React from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { RemoveIcon } from '@/core/components';

const actions = [
    { icon: <FileCopyIcon color='warning' />, codDoc:"NE", name: 'Nota Entrega' },
    { icon: <FileCopyIcon color='primary' />, codDoc: "FV", name: 'Factura' },
    { icon: <SaveIcon color='success' />, codDoc: "OR", name: 'Guardar' }, 
    { icon: <RemoveIcon color='success' />, codDoc: "D", name: 'Guardar' }, 
];

export default function CartMobileAction() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        console.log('open sped')
        setOpen(!open);
    }
    const handleClose = () => setOpen(false);

    return (
        
           
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
                //onClose={handleClose}
                onClick={handleOpen}
                open={open}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={handleClose}
                    />
                ))}
            </SpeedDial>
        
    );
}
