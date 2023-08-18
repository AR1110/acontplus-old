import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { saleStore } from '@/stores';

export default function TableSelect() {
  const [age, setAge] = React.useState('');
  const dataForm = saleStore(state=>state.dataForm);

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <FormControl margin='normal' size="small" fullWidth>
      <InputLabel id="Mesa">Mesa</InputLabel>
      <Select
        labelId="Mesa"
        id="demo-select-small"
        value={age}
        label="Mesa"
        onChange={handleChange}
      >
        
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {dataForm.tables.map((option, key) => (
          <MenuItem key={key} value={option.tableId}>
            {option.description}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
