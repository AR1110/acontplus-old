import { Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function CategoryPage() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={5}
    >
      <Typography variant="h5" gutterBottom>
        Categoria
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />}>
        Nuevo
      </Button>
    </Stack>
  );
}
