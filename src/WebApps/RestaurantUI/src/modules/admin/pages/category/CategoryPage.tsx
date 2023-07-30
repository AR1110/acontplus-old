import { Button, Grid, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { CategoryProvider } from './context/CategoryProvider';
import CategoryTable from './components/CategoryTable';
import DialogCustom from '@/core/components/DialogCustom';
import CategoryDialog from './components/CategoryDialog';

export default function CategoryPage() {
  const [open, setOpen] = useState(false);

  // const enumeracion = 1;
  const onOpenDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <CategoryProvider>
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

        <CategoryTable></CategoryTable>
      </Grid>

      <DialogCustom
        id="ringtone-menu"
        keepMounted
        open={open}
        onClose={handleClose}
        children={<CategoryDialog handleClose={handleClose} />}
        maxWidth="md"
      />
    </CategoryProvider>
  );
}
