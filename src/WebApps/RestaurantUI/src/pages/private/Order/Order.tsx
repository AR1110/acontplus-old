import { PrivateRoutes } from "@/core/models";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

 
export default function Order() {
    const navigate = useNavigate();
    const handleNewOrder = ()=>{
        navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.SALE}`, {replace: true})
    }
  return (
    <div>
        <Button variant="contained" onClick={handleNewOrder}>Nuevo Pedido</Button>
    </div>
  )
}
