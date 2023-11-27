
import { CATEGORY_CODE } from "@/core/models";
import { useSaleStore } from "@/stores";
import Promotion from "../Promotion/Promotion";
import { Box, Grid } from "@mui/material";
import ItemList from "./ItemList";
import ItemPagination from "./ItemPagination";

type ItemContentProps = {
  loading: boolean
}
const ItemContent = ({ loading }: ItemContentProps) => {
  const itemSearch = useSaleStore(state => state.itemSearch);

  const renderContent = () => {
    if(itemSearch.code === CATEGORY_CODE.PROM){
      return <Promotion />
    } else{
      return <ItemList loading={loading} />
    }
  } 
  return (
    <Box sx={{ pt: 2 }}>
      <Grid container
        
        columns={{ xs: 12, sm: 12, md: 12 }}
        sx={{
          pr: 1,
          pb: 1,
          height: "440px", // Ajusta la altura según tus necesidades
          overflow: 'auto', // Agrega el scroll si el contenido excede la altura 
          // Consulta de medios para tamaños de pantalla más pequeños
          '@media (max-width: 600px)': {
            height: '400px', // Altura reducida para pantallas más pequeñas
          },
        }}>

        {
          renderContent()
        } 
      </Grid>
      <ItemPagination />
    </Box>
  )
}

export default ItemContent