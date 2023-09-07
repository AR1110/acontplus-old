import Dialog from "@mui/material/Dialog";
import {
    useMediaQuery,
    useTheme,
} from "@mui/material";

import { ReactNode, useEffect, useState } from "react";  
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
    console.log(setOpen)
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
