import { Button, Grid, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react'; 
import CategoryTable from './components/CategoryTable';
import {DialogCustom} from '@/core/components/DialogCustom';
import CategoryDialog from './components/CategoryDialog';
import { ErrorBoundary } from '@/core/utils';
import { CategorySvc } from '@admin/services';
import { CategoryReadDto } from '../../models';

export default function CategoryPage() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Array<CategoryReadDto>>([]);
  // const enumeracion = 1;
  const onOpenDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCategories = function(){
    try {
      CategorySvc.getAll().then((response) => {
        
        setCategories(response);
			});      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCategories();
  }, [])

  return ( 
    <ErrorBoundary fallBackComponent={<>Error!</>}>
      <Grid item xs={12}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Typography variant="h5" gutterBottom>
            Categorías
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onOpenDialog}
          >
            Agregar
          </Button>
        </Stack>

        <CategoryTable categories={categories}/>
      </Grid>

      {
        open && <DialogCustom
        id="ringtone-menu"
        keepMounted
        open={open}
        onClose={handleClose}
        children={<CategoryDialog handleClose={handleClose} />}
        maxWidth="md"
      /> 
      }
        
      </ErrorBoundary>
  );
}
