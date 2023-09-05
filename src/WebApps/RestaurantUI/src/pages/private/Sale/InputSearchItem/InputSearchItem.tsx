
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase'; 
import IconButton from '@mui/material/IconButton'; 
import SearchIcon from '@mui/icons-material/Search'; 
import { useSaleStore } from '@/stores';

const InputSearchItem = () => {
  const filterOderItems = useSaleStore(state=>state.filterOderItems);

  return (
    <Paper
       
      sx={{mb:1, p: '2px 4px', display: 'flex', alignItems: 'center', width: "auto" }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="menu">
        {/* <MenuIcon /> */}
      </IconButton>
      <InputBase
        onChange={(e)=>filterOderItems(e.target.value)}       
        sx={{ ml: 1, flex: 1}}
        placeholder="Buscar Item"
        inputProps={{ 'aria-label': 'Buscar Item' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon /> 
      </IconButton>
      {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
        <DirectionsIcon />
      </IconButton> */}
    </Paper>
  );
}


export default InputSearchItem;