
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CategoryIcon } from '@/core/components';
import { useState } from 'react';
import { Avatar, Paper } from '@mui/material';
import { useSaleStore } from '@/stores/saleStore';
import { itemSearchInitialState } from '@/core/models';
import { ErrorBoundary } from '@/core/utilities';

export default function Category() {
  const setItemSearch = useSaleStore(state => state.setItemSearch);
  const categories = useSaleStore(state => state.dataForm.categories)
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, index: number) => {
    const dataCategory = categories.find((i, indexCategory)=>indexCategory===index);
    
     
    setItemSearch({
      ...itemSearchInitialState,
      checkSubFamilia: dataCategory && dataCategory.idSubFamilia > 0 ? true: false,
      idSubFamilia: dataCategory?.idSubFamilia ?? 0
    }) 
    setValue(index);
  };


  return (
    <ErrorBoundary fallBackComponent={<>Error al cargar categorias!</>}>

      <Paper   sx={{
        borderRadius: '12px', 
      }} elevation={0}>

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
