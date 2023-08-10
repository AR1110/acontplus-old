import Box from '@mui/material/Box';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CategoryIcon } from '@/core/components';
import { useState } from 'react';
import { CategoryReadDto } from '@/core/models/category.models';
import { useAsync, useFetchAndLoad } from '@/hooks';
import { CategoryService as CategorySvc } from '@/core/services';
import { categoryAdapter } from '@/core/adapters';

export default function ScrollableTabsButtonVisible() {
  const [categories, setCategories] = useState<Array<CategoryReadDto>>([]); 

  const { loading, callEndpoint } = useFetchAndLoad();
 

  const getApiData = async () => await callEndpoint(CategorySvc.getAll());

  const categoriesMapper = function (response: any) {    
    setCategories(categoryAdapter.tableReadAdaptFromApi(JSON.parse(response.payload)));
  };

  useAsync(getApiData, categoriesMapper, () => {
      console.log('init')
  }, []);

  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return ( 
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        aria-label="visible arrows tabs example"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {categories.map((item, index) =>(
          <Tab key={index} icon={<CategoryIcon />} label={item.description} wrapped/>
        ))}
        {/* <Tab icon={<CategoryIcon />} label="FAVORITES" /> */}
        {/* <Tab icon={<CategoryIcon />} label="NEARBY" />
        <Tab label="Item Four" />
        <Tab label="Item Five" />
        <Tab label="Item Six" />
        <Tab label="Item Seven" /> */}
      </Tabs> 
 
  );
}
