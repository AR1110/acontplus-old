
import { ErrorBoundary } from "@/core/utilities";
import { Grid, useMediaQuery } from "@mui/material";
import CategoryTab from "./components/CategoryTab";
import { saleStore } from "@/stores/saleStore";
import { useAsync, useFetchAndLoad } from "@/hooks";
import { ItemService, SaleService } from "@/core/services";
import { categoryReadAdapter, decimalSaleReadAdapter, itemReadAdapter, tableReadAdapter } from "@/core/adapters";
import CollectionItem from "./components/CollectionItem";
import SaleRight from "./components/SaleRight";
import { useAuthStore } from "@/stores/authStore";
import { Establecimiento } from "@/core/models";
import CustomBottomNavigation from "./components/CustomBottomNavigation";


export default function Sale() { 
    const isMobile = useMediaQuery('(max-width:900px)');
    const setDataForm = saleStore(state =>  state.setDataForm)    
    const estabs = useAuthStore(state => state.estabs);
    const dataEstab = estabs[0] as Establecimiento;
    
    const { itemSearch, setCollectionItems } = saleStore(state => ({
        itemSearch: state.itemSearch,
        setCollectionItems: state.setCollectionItems
    }));
    
    //Fetch 
    const { loading, callEndpoint } = useFetchAndLoad();

    //Fetch  
    const getDataForFormApi = async () => await callEndpoint(SaleService.getDataForForm(JSON.stringify({
        codEstab: dataEstab.codEstab
    })));
    const getItemsApi = async () => await callEndpoint(ItemService.getAll(itemSearch));
 
    const adaptDataForm = (response: any) => {
        const {subCategorias, configDecimal, table} = response;
        setDataForm({
            categories: categoryReadAdapter(subCategorias),
            decimal: decimalSaleReadAdapter(configDecimal[0]),
            tables: tableReadAdapter(table)

        })    
    }

    const itemAdapter = (response: any) => { 
        setCollectionItems([]) 
        const items = itemReadAdapter(response.items || []);
        setCollectionItems(items)

    }
 
    useAsync(getDataForFormApi, adaptDataForm, () => {
        console.log('init')
    }, []);

    //useEffect React
    useAsync(getItemsApi, itemAdapter, () => {
        console.log('init')
    }, [itemSearch]); 

    return (
        <ErrorBoundary fallBackComponent={<>Error!</>}>
       
            <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                    <Grid item xs={12} md={12}>
                        <CategoryTab />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <CollectionItem loading={loading} />
                    </Grid>
                </Grid>
                <Grid item xs={12} md={5}>
                    {
                        isMobile ? <></> : <SaleRight/>
                    }                    
                  
                </Grid>
            </Grid> 
            <CustomBottomNavigation isMobile={isMobile}/>
        </ErrorBoundary>
    );
}
