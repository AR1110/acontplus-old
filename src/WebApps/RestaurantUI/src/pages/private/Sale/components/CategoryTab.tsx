 
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CategoryIcon } from '@/core/components';
import { useState } from 'react'; 
import { Avatar, Paper } from '@mui/material';
import { saleStore } from '@/stores/saleStore';
import { itemSearchInitialState, productFilterInitialState } from '@/core/models';

export default function ScrollableTabsButtonVisible() { 
  const setItemSearch = saleStore(state => state.setItemSearch); 
  const categories = saleStore(state=>state.dataForm.categories)
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, index: number) => {
    if (index === 0) {
      setItemSearch(itemSearchInitialState)
    } else {
      setItemSearch({
        ...productFilterInitialState,
        checkSubFamilia: true,
        idSubFamilia: categories[index - 1]?.idSubFamilia!
      })
    }
    setValue(index);
  };


  return (
    <Paper sx={{
        borderRadius: '12px',
      }} elevation={1}>

      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        aria-label="Tabs Categories"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        <Tab icon={<CategoryIcon />} label="Todos" />
        {categories.map((item, index) => (
          <Tab key={index} icon={<Avatar alt={item.description} src={item.s3ObjectUrl}
          > <CategoryIcon /></Avatar>} label={item.description} wrapped />
        ))}
      </Tabs>
    </Paper>
  );
}
