import {TextField} from "@mui/material";
import {useCheckoutContext} from "@/core/components/Checkout/context";


export const InputObservacion = ()=>{
    const {observacion, setObservacion} = useCheckoutContext();
    return (
       <TextField
           fullWidth

           label="Observación"
           id="observacion"
           name="observacion"
           value={observacion}
           onChange={(e) => {
               setObservacion(e.target.value)
           }}
       />
   )
}