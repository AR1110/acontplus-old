import { IconButton, InputAdornment, TextField } from "@mui/material";
export default function CustomerSearch() {
  return (
    <TextField
      hiddenLabel
      id="outlined-size-small"
      size="small"
      placeholder="Buscar cliente"
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="Buscador cliente"
              edge="end"
              color="primary"
            >
              <i className="mdi mdi-account-plus"></i>
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
