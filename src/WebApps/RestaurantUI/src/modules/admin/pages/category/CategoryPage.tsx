import { Button, Grid, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import CategoryTable from './components/CategoryTable';
import { DialogCustom, dialogOpenSubject$ } from '@/core/components';
import CategoryDialog from './components/CategoryDialog';
import { ErrorBoundary } from '@/core/utils';
import { CategorySvc } from '@admin/services';
import { CategoryReadDto } from '../../models';
import { useAsync, useFetchAndLoad } from '@/hooks';
import BackdropLoader from '@/core/components/BackdropLoader';

export default function CategoryPage() {
  const [categories, setCategories] = useState<Array<CategoryReadDto>>([]); 
  const [reloadFetchApi, setReloadFetchApi] = useState(false); 
  
  const { loading, callEndpoint } = useFetchAndLoad();

  const onOpenDialog = () => { 
    
    dialogOpenSubject$.setSubject = true;
  }; 

  const getApiData = async () => await callEndpoint(CategorySvc.getAll());
  
  const categoriesMapper = function (response:any) {  
    const categoriesApi: CategoryReadDto[] = JSON.parse(response.payload) 
    setCategories(categoriesApi);
  };

  useAsync(getApiData, categoriesMapper, () => {
    console.log('init')
  }, [reloadFetchApi]); 

  const callBackCloseDialog = () => {
    setReloadFetchApi(!reloadFetchApi)
  }
  

  
  
  return (
    <ErrorBoundary fallBackComponent={<>Error!</>}>

      {loading ? <BackdropLoader open={loading}/> : <Grid item xs={12}>
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

        <CategoryTable categories={categories} callBackCloseDialog={callBackCloseDialog} />
      </Grid>
      }
      <DialogCustom maxWidth='sm' children={<CategoryDialog callBackCloseDialog={callBackCloseDialog} />}
      />
    </ErrorBoundary>
  );
}
