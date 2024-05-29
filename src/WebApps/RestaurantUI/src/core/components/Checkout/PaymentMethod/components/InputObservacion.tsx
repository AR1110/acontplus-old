import {TextField} from "@mui/material";
import {usePaymentStore} from "@/store/payment/paymentStore..ts";


export const InputObservacion = ()=>{
    const { observacion, setObservacion } = usePaymentStore(state => state);
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