import Dialog from "@mui/material/Dialog";
import {
    useMediaQuery,
    useTheme,
} from "@mui/material";

import { ReactNode, useEffect, useRef, useState } from "react";
import { SubjectManager } from "../models";
import { Subscription } from "rxjs";

// eslint-disable-next-line react-refresh/only-export-components
export const dialogOpenSubject$ = new SubjectManager<boolean>();
// eslint-disable-next-line react-refresh/only-export-components
export const dialogCloseSubject$ = new SubjectManager<boolean>();

type SizeDialog = "xs" | "sm" | "md" | "lg" | "xl";

export interface DialogProps {
    // id: string;
    // keepMounted: boolean;
    // value?: string;
    // open: boolean;
    // onClose: (value?: string) => void;
    children: ReactNode;
    maxWidth?: SizeDialog;
}

function DialogCustom({children, maxWidth, ...other}: DialogProps) {  
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md")); 

    const [open, setOpen] = useState(false);
    let openSubject$ = new Subscription();
    let closeSubject$ = new Subscription();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        openSubject$ = dialogOpenSubject$.getSubject.subscribe(() => handleClickOpen());
        // eslint-disable-next-line react-hooks/exhaustive-deps
        closeSubject$ = dialogCloseSubject$.getSubject.subscribe(() => handleClose());
        return () => {
            openSubject$.unsubscribe();
            closeSubject$.unsubscribe();
        };
    }, []);

    const handleClickOpen = () => {
        console.log('open Modal')
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleExit = () => {
        console.log('close Modal');
        // dialogCloseSubject$.setSubject = false;
    };

    
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        maxWidth={maxWidth}
        open={open}
        onClose={() => handleExit()} 
        aria-labelledby="Custom Dialog"
        aria-describedby="Custom Dialog" 
        keepMounted        
        {...other}
      >
        {children}
      </Dialog>
    </div>
  );
}

export {
    DialogCustom
}
