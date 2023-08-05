import { Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { dialogOpenSubject$ } from '@/core/components';

export default function HeaderProductionArea() {
  const onOpenDialog = () => {
    dialogOpenSubject$.setSubject = true;
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={1}
    >
      <Typography variant="h5" gutterBottom>
        Areas de producción
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onOpenDialog}
      >
        Agregar
      </Button>
    </Stack>
  );
}
