
import { ErrorBoundary } from "@/core/utilities";
import { Box, Grid, Paper } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import CategoryTab from "./components/CategoryTab";
import CustomerSearch from "./components/CustomerSearch";
import { CategoryReadDto, ProductReadDto } from "@/core/models";
import { useAsync, useFetchAndLoad } from "@/hooks";
import { ProductService as productSvc } from "@/core/services";
import ProductSkeleton from "./components/ProductSkeleton";
import ProductCard from "./components/ProductCard"; 
import { productReadAdapter } from "@/core/adapters";


interface PosState {
    categories: Array<CategoryReadDto>,
    products: Array<ProductReadDto>
}

export default function Pos() {

    const [value, setValue] = useState(0);
    const [categories, setCategories] = useState<PosState["categories"]>([])
    const [products, setProducts] = useState<PosState["products"]>([])

    //Fetch 
    const { loading, callEndpoint } = useFetchAndLoad();

    //Fetch products 
    const getProductsApi = async () => await callEndpoint(productSvc.getAll());
    const productAdapter = (response: any) => {
        
        const products = productReadAdapter(JSON.parse(response.payload)[0]);
        console.log(products);
        setProducts(products);
    }



    //useEffect React
    useAsync(getProductsApi, productAdapter, () => {
        console.log('init')
    }, []);

    // const handleChange = (event: SyntheticEvent, newValue: number) => {
    //     setValue(newValue);
    // };






    return (
        <ErrorBoundary fallBackComponent={<>Error!</>}>

            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                <Box gridColumn={{ xs: 'span 12', sm: 'span 8' }}>
                    <Paper sx={
                        {
                            borderRadius: '16px',
                        }
                    } elevation={3}>
                        <CategoryTab />
                    </Paper>
                </Box>
                <Box gridColumn={{ xs: 'span 12', sm: 'span 4' }}>
                    <CustomerSearch />

                    <Paper sx={
                        {
                            p: 1,
                            mt: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '16px',
                            flexGrow: 1,
                            bgcolor: 'background.paper'
                        }
                    } elevation={3} >
                        Items
                    </Paper>
                </Box>
                <Box gridColumn={{ xs: 'span 12', sm: 'span 8' }}>
                    <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 12, sm: 12, md: 12 }}>

                        {loading ?
                            (<ProductSkeleton />)
                            :
                            (
                                products.map((product, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                        <ProductCard product={product} />
                                    </Grid>
                                ))
                            )
                        }
                    </Grid>
                </Box>
            </Box> 

        </ErrorBoundary>
    );
}
