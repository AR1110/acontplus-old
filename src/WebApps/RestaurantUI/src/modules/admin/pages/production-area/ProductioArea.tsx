import { ErrorBoundary } from '@/core/utils/ErrorBoundary';
import { Grid } from '@mui/material';
import { ProductionAreaSvc } from '../../services/production-area.service';
import { useAsync, useFetchAndLoad } from '@/hooks';
import { useState } from 'react';
import BackdropLoader from '@/core/components/BackdropLoader';
import HeaderProductionArea from './componets/header.component';
import TableComponent from './componets/table.component';
import { ProductionAreaReadDto } from '../../models/production-area.model';
import { DialogCustom } from '@/core/components';
import DialogComponent from './componets/dialog.component';

export default function ProductArea() {
  const [productionArea, setProductionAreas] = useState<
    Array<ProductionAreaReadDto>
  >([]);
  const [reloadFetchApi, setReloadFetchApi] = useState(false);
  const { loading, callEndpoint } = useFetchAndLoad();

  const getApiData = async () => await callEndpoint(ProductionAreaSvc.getAll());

  const productionAreaMapper = function (response: any) {
    const productionAreaApi: ProductionAreaReadDto[] = response;
    setProductionAreas(productionAreaApi);
  };

  useAsync(
    getApiData,
    productionAreaMapper,
    () => {
      console.log('init');
    },
    [reloadFetchApi]
  );

  const callBackCloseDialog = () => {
    setReloadFetchApi(!reloadFetchApi);
  };

  return (
    <ErrorBoundary fallBackComponent={<>Error</>}>
      {loading ? (
        <BackdropLoader open={loading} />
      ) : (
        <Grid item xs={12}>
          <HeaderProductionArea></HeaderProductionArea>
          <TableComponent
            productionArea={productionArea}
            callBackCloseDialog={callBackCloseDialog}
          ></TableComponent>
        </Grid>
      )}
      <DialogCustom
        maxWidth="xl"
        children={<DialogComponent callBackCloseDialog={callBackCloseDialog} />}
      ></DialogCustom>
    </ErrorBoundary>
  );
}
