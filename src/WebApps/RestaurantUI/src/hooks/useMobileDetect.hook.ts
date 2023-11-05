import { useMediaQuery } from "@mui/material"; 


export const useMobileDetect = ()=>{
    const isMobile = useMediaQuery('(max-width:900px)');

    return {
        isMobile
    }
} 