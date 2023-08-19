import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { saleStore } from '@/stores';

export default function TableSelect() {
  const [table, setAge] = React.useState('');
  const dataForm = saleStore(state=>state.dataForm);
  const setSummary = saleStore(state=>state.setSummary)
  const summary = saleStore(state=>state.summary)

  const handleChange = (event: SelectChangeEvent) => {
     setSummary({
      ...summary,
      tableId: Number(event.target.value)
     }) 
  };
  

  return (
    <FormControl margin='normal' size="small" fullWidth>
      <InputLabel id="Mesa">Mesa</InputLabel>
      <Select
        labelId="Mesa"
        id="demo-select-small"
        value={summary.tableId.toString()}
        label="Mesa"
        onChange={handleChange}
      >
        
        <MenuItem value={0}>
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
