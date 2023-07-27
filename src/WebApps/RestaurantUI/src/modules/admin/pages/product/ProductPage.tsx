import { 
  Button, 
  Grid, 
  Stack, 
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
 
import { useState } from "react";
 
import { ProductProvider} from "./context";
import { ProductDialog, ProductTable } from "./components";
import DialogCustom from "@/core/components/DialogCustom";
 

export default function ProductPage() {    
  const [open, setOpen] = useState(false); 
  
  // const enumeracion = 1;
  const onOpenDialog = () => {  
    setOpen(true);
  };

  const handleClose = (newValue?: string) => {
    setOpen(false); 
  };
 
  return ( 
    <ProductProvider >
      <Grid item xs={12}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Typography variant="h5" gutterBottom>
            Productos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onOpenDialog}
          >
            Agregar
          </Button>
        </Stack>
        
         <ProductTable/>
       
      </Grid> 

      <DialogCustom
        id="ringtone-menu"
        keepMounted
        open={open}
        onClose={handleClose} 
        children={<ProductDialog handleClose={handleClose} />}
        maxWidth="md"
      />
    </ProductProvider>
    
  );
}
