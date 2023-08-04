import { TextField } from '@mui/material';

export default function SearchComponent() {
  const searchArticle = (e: React.FocusEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <TextField
      onBlur={searchArticle}
      type="search"
      fullWidth
      label="Buscar platos"
      size="small"
    />
  );
}
