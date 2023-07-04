import { InputAdornment, TextField } from "@mui/material";

export default function ProductSearch() {
  return (
    <TextField
      hiddenLabel
      id="outlined-size-small"
      size="small"
      placeholder="Buscar producto"
      fullWidth
      InputProps={{
        // startAdornment: (
        //   <InputAdornment position="start">
        //     <i className="fas fa-search"></i>
        //   </InputAdornment>
        // ),
        endAdornment: (
          <InputAdornment position="end">
            <i className="fas fa-barcode"></i>
          </InputAdornment>
        ),
      }}
    />
  );
}
