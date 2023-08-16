
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CategoryIcon } from '@/core/components';
import { useState } from 'react';
import { Avatar, Paper } from '@mui/material';
import { saleStore } from '@/stores/saleStore';
import { itemSearchInitialState } from '@/core/models';
import { ErrorBoundary } from '@/core/utilities';

export default function ScrollableTabsButtonVisible() {
  const setItemSearch = saleStore(state => state.setItemSearch);
  const categories = saleStore(state => state.dataForm.categories)
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, index: number) => {
    if (index === 0) {
      setItemSearch(itemSearchInitialState)
    } else {
      setItemSearch({
        ...itemSearchInitialState,
        checkSubFamilia: true,
        idSubFamilia: categories[index - 1]?.idSubFamilia!
      })
    }
    setValue(index);
  };


  return (
    <ErrorBoundary fallBackComponent={<>Error al cargar categorias!</>}>

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

          {categories.map((item, index) => (
            <Tab key={index} icon={<Avatar alt={item.description} src={item.s3ObjectUrl}
            > <CategoryIcon /></Avatar>} label={item.description} wrapped />
          ))}
        </Tabs>
      </Paper>
    </ErrorBoundary>
  );
}
