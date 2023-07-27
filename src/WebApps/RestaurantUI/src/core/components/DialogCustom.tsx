import Dialog from "@mui/material/Dialog";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import { useEffect, useRef, useState } from "react";

type SizeDialog = "xs" | "sm" | "md" | "lg" | "xl";

export interface DialogProps {
    id: string;
    keepMounted: boolean;
    value?: string;
    open: boolean;
    onClose: (value?: string) => void;
    children: JSX.Element | JSX.Element[];
    maxWidth?: SizeDialog;
}

function DialogCustom(props: DialogProps) {
    const {
        onClose,
        value: valueProp,
        open,
        children,
        maxWidth,
        ...other
    } = props;
    const [value, setValue] = useState(valueProp);
    const radioGroupRef = useRef<HTMLElement>(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        if (!open) {
            setValue(valueProp);
        }
    }, [valueProp, open]);

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose(value);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            maxWidth={maxWidth}
            TransitionProps={{ onEntering: handleEntering }}
            open={open}
            {...other}
        >
            <LinearProgress />
            {children}
        </Dialog>
    );
}

export default DialogCustom;
