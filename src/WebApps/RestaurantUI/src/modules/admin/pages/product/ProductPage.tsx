import { Button, Grid, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { useState } from 'react';

import { ProductProvider } from './context';
import { ProductDialog, ProductTable } from './components';
import { DialogCustom } from '@/core/components/DialogCustom';
import { ErrorBoundary } from '@/core/utils';

export default function ProductPage() {
  const [open, setOpen] = useState(false);
  // const enumeracion = 1;
  const onOpenDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ProductProvider>
      <ErrorBoundary fallBackComponent={<>Error!</>}>
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

          <ProductTable />
        </Grid>

        <>
          {open ? (
            <DialogCustom
              id="ringtone-menu"
              keepMounted
              open={open}
              onClose={handleClose}
              children={
                <ProductDialog
                  handleClose={handleClose}
                  dialogTitle="Nuevo Articulo"
                />
              }
              maxWidth="md"
            />
          ) : (
            ''
          )}
        </>
      </ErrorBoundary>
    </ProductProvider>
  );
}
