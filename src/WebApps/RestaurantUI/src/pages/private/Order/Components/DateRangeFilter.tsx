import * as React from 'react';
import { Dayjs } from 'dayjs'; 
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type DateRangeFilterProps = {
    label: string
    value: Dayjs
    onChange(value: Dayjs | null):void   
}
export default function DateRangeFilter({label, value, onChange}: DateRangeFilterProps) {
//   const [value, setValue] = React.useState<Dayjs | null>(null);
   
  return (  
        <DatePicker   format="DD/MM/YYYY" label={label} value={value} onChange={(newValue) => onChange(newValue)} />
    
  );
}
