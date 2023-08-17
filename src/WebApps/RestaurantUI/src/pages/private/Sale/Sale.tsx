
import { ErrorBoundary } from "@/core/utilities";
import { Grid, useMediaQuery } from "@mui/material";
import CategoryTab from "./components/CategoryTab"; 
import { useAsync, useFetchAndLoad } from "@/hooks";
import { ItemService, SaleService } from "@/core/services"; 
import CollectionItem from "./components/CollectionItem";
import SaleRight from "./components/SaleRight";
 
import { Establecimiento } from "@/core/models";
import CustomBottomNavigation from "./components/CustomBottomNavigation";
import { saleStore, useAuthStore } from "@/stores";
import { useEffect } from "react";
import { itemReadAdapter } from "@/core/adapters";


export default function Sale() {
    const isMobile = useMediaQuery('(max-width:900px)');

    const setDataForm = saleStore(state => state.setDataForm)
    const setDataEstab = useAuthStore(state => state.setDataEstab);
    const estabs = useAuthStore(state => state.estabs);
        
    const { itemSearch, setCollectionItems } = saleStore(state => ({
        itemSearch: state.itemSearch,
        setCollectionItems: state.setCollectionItems
    }));

    useEffect(()=>{  
        let dataEstab = estabs[0] as Establecimiento
        setDataEstab(dataEstab)
        SaleService.getDataForForm(JSON.stringify({
            codEstab: dataEstab.codEstab
        })).then(response=>{
            setDataForm(response)
        })                   
    }, [])

  
    //Fetch 
    const { loading, callEndpoint } = useFetchAndLoad();
    const getItemsApi = async () => await callEndpoint(ItemService.getAll(itemSearch));
 
    const itemAdapter = (response: any) => {
        setCollectionItems([])
        const items = itemReadAdapter(response.items || []);
        setCollectionItems(items) 
    } 

    //se ejecuta cada vez que cambian la categoria
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
                        isMobile ? <></> : <SaleRight />
                    }

                </Grid>
            </Grid>
            <CustomBottomNavigation isMobile={isMobile} />
        </ErrorBoundary>
    );
}
