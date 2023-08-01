import { Button, Grid, Skeleton, Stack, TableCell, TableRow, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import CategoryTable from './components/CategoryTable';
import { DialogCustom, dialogOpenSubject$ } from '@/core/components';
import CategoryDialog from './components/CategoryDialog';
import { ErrorBoundary } from '@/core/utils';
import { CategorySvc } from '@admin/services';
import { CategoryReadDto, CategoryReadDtoMapper } from '../../models';
import { useAsync, useFetchAndLoad } from '@/hooks';
import BackdropLoader from '@/core/components/BackdropLoader';

export default function CategoryPage() {
  const [categories, setCategories] = useState<Array<CategoryReadDto>>([]);
  // const enumeracion = 1;
  const onOpenDialog = () => {
    dialogOpenSubject$.setSubject = true;
  };

  // const getCategories = function () {
  //   try {
  //     CategorySvc.getAll().then((response) => { 
  //       setCategories(response);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   getCategories();
  // }, [])
  const { loading, callEndpoint } = useFetchAndLoad();
  const getApiData = async () => await callEndpoint(CategorySvc.getAll());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoriesMapper = function (data: any) {
    const categoriesApi: CategoryReadDto[] = JSON.parse(data)
    // const results =  categoriesApi.map(item =>({ 
    //   codigo: item.codigo,
    //   descripcion: item.descripcion,
    //   estado: item.estado,
    //   idFamilia: item.idFamilia,
    //   idSubFamilia: item.idSubFamilia,
    //   montoObjetivo: item.montoObjetivo,
    //   nombreFamilia: item.nombreFamilia,
    //   siglas: item.siglas,
    //   totalRecords: item.totalRecords
    // }) )

    setCategories(categoriesApi)
  };

  useAsync(getApiData, categoriesMapper, () => {
    console.log('init')
  });

  const renderTableSkeleton = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
      </TableRow>
    ));
  };

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

        <CategoryTable categories={categories} />
      </Grid>
      }
      <DialogCustom maxWidth='sm' children={<CategoryDialog />}
      />
    </ErrorBoundary>
  );
}
