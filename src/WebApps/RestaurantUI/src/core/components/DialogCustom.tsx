import Dialog from "@mui/material/Dialog";
import { 
    LinearProgress,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import { useRef} from "react";

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
        value,
        open,
        children,
        maxWidth,
        ...other
    } = props; 
    const radioGroupRef = useRef<HTMLElement>(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
 

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            console.log(onClose, value)
            radioGroupRef.current.focus();
        }
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

export {
    DialogCustom
}
