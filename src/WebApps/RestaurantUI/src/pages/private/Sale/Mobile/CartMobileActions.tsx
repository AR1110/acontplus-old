import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { RemoveIcon } from '@/core/components/IconsMaterial';
import { useSaleStore } from '@/stores';
import { DOC_TYPE } from '@/core/constants'; 

const actions = [
    { icon: <FileCopyIcon color='warning' />, codDoc: "NE", name: 'Nota Entrega' },
    { icon: <FileCopyIcon color='primary' />, codDoc: "FV", name: 'Factura' },
    { icon: <SaveIcon color='success' />, codDoc: "OR", name: 'Guardar' },
    { icon: <RemoveIcon color='error' />, codDoc: "D", name: 'Limpiar' },
];

export default function CartMobileAction() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(!open);
    const handleClose = () => setOpen(false);
 
    const { save } = useSaleStore(state => ({
        save: state.save,
        items: state.items,
    }));

    //store checkout   
    const resetForm = useSaleStore(state => state.resetForm); 

    //Even Navigation 
    const navigation = useSaleStore(state => state.navigation); 

    const handleTypeAction = (codDoc: string) => {
        if (codDoc === DOC_TYPE.OR) {
            resetForm();
            navigation.closeDialogCustom();
            return
        }
        setOpen(false);
        save(codDoc);
    }
  
    return (


        <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onClick={handleOpen}
            open={open}
        >
            {actions.map((action, key) => (
                <SpeedDialAction
                    key={key}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    tooltipOpen
                    onClick={() => handleTypeAction(action.codDoc)}
                />
            ))}
        </SpeedDial>

    );
}
