
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CategoryIcon } from '@/core/components/IconsMaterial';
import { useState } from 'react';
import { Avatar, Paper } from '@mui/material';
import { useSaleStore } from '@/stores/saleStore';
import { CATEGORY_CODE, itemSearchInitialState } from '@/core/models';
import { ErrorBoundary } from '@/core/utilities';
import useFetchItems from '../hooks/useFetchItems.hook';

export default function Category() {
  const { setItemSearch } = useSaleStore(state => ({
    itemSearch: state.itemSearch,
    setItemSearch: state.setItemSearch,
  }));
  const setCollectionItems = useSaleStore(state => state.setCollectionItems);
  const { fetchItem } = useFetchItems()
  const categories = useSaleStore(state => state.dataForm.categories)
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, index: number) => {
    let tipo = 2;
    const dataCategory = categories.find((_, indexCategory) => indexCategory === index);

    if (dataCategory?.code === CATEGORY_CODE.COM) tipo = 3;

    const paramsQuery = {
      ...itemSearchInitialState,
      checkSubFamilia: dataCategory && dataCategory.idSubFamilia > 0 ? true : false,
      idSubFamilia: dataCategory?.idSubFamilia ?? 0,
      code: dataCategory?.code ?? "",
      tipo
    }
    setItemSearch(paramsQuery)
    setCollectionItems([])
    setValue(index);
    if (dataCategory?.code !== CATEGORY_CODE.PROM) {
      fetchItem(paramsQuery).then(response => {
        setCollectionItems(response)
      })
    }
  };


  return (
    <ErrorBoundary fallBackComponent={<>Error al cargar categorias!</>}>

      <Paper sx={{
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
