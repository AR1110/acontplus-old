import * as React from 'react';
import { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'; 
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type DateRangeFilterProps = {
    label: string
}
export default function DateRangeFilter({label}: DateRangeFilterProps) {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  console.log(value)
  return (  
        <DatePicker label={label} value={value} onChange={(newValue) => setValue(newValue)} />
    
  );
}
