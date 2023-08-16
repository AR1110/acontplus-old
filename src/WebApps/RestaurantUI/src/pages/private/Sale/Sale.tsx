
import { ErrorBoundary } from "@/core/utilities";
import { Badge, Box, Button, Divider, Grid, Paper } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import CategoryTab from "./components/CategoryTab";
import CustomerSearch from "./components/CustomerSearch";
import { CategoryReadDto, ProductReadDto } from "@/core/models";
import { useAsync, useFetchAndLoad } from "@/hooks";
import { ProductService as productSvc } from "@/core/services";
import ProductSkeleton from "./components/ProductSkeleton";
import ProductCard from "./components/ProductCard";
import { productReadAdapter } from "@/core/adapters";
import ShoppingCart from "./components/ShoppingCart";
import { AddShoppingCartIcon, MonetizationOnIcon, RestartAltIcon } from "@/core/components";
import { saleStore } from "@/stores/saleStore";
import CartTotals from "./components/CartTotals";


interface PosState {
    categories: Array<CategoryReadDto>,
    products: Array<ProductReadDto>
}

export default function Sale() {

    const [value, setValue] = useState(0);
    const [categories, setCategories] = useState<PosState["categories"]>([])
    const [products, setProducts] = useState<PosState["products"]>([])
    const totalItems = saleStore(state=>state.totalItems);
    const resetForm = saleStore(state=>state.resetForm);
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
                <Box gridColumn={{ xs: 'span 12', sm: 'span 7' }}>
                    <Paper sx={
                        {
                            borderRadius: '16px',
                        }
                    } elevation={3}>
                        <CategoryTab />
                    </Paper>


                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 12, sm: 12, md: 12 }} sx={{
                            pr: 1,
                            height: "460px", // Ajusta la altura según tus necesidades
                            overflow: 'auto', // Agrega el scroll si el contenido excede la altura

                            // Consulta de medios para tamaños de pantalla más pequeños
                            '@media (max-width: 600px)': {
                                height: '400px', // Altura reducida para pantallas más pequeñas
                            },
                        }}>

                            {loading ?
                                (<ProductSkeleton />)
                                :
                                (
                                    products.map((product, index) => (
                                        <Grid
                                            item xs={12}
                                            sm={6}
                                            md={3}
                                            key={index}

                                        >
                                            <ProductCard product={product} />
                                        </Grid>
                                    ))
                                )
                            }
                        </Grid>
                    </Box>
                </Box>
                <Box gridColumn={{ xs: 'span 12', sm: 'span 5' }}>
                    {/* <CustomerSearch /> */}

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
                        <Box sx={{ flexGrow: 1, mb: 2 }}>
                            <Grid container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center">
                                <Grid item xs={8}>
                                    <CustomerSearch />
                                </Grid>
                                <Grid item xs={1}> 
                                    <Badge badgeContent={totalItems} color="secondary">
                                        <AddShoppingCartIcon/>                                    
                                    </Badge>
                                </Grid>
                            </Grid>
                        </Box>
                       
                        <ShoppingCart />
                        
                        <CartTotals/>

                        <Box sx={{ flexGrow: 1, p: 2 }}>
                            <Grid container spacing={2} columns={16}>
                                <Grid item xs={8}>
                                    <Button color="error" variant="contained" size="large" fullWidth endIcon={<RestartAltIcon />} onClick={resetForm}>
                                        Limpiar
                                    </Button>
                                </Grid>
                                <Grid item xs={8}>
                                    <Button color="success" variant="contained" size="large" fullWidth endIcon={<MonetizationOnIcon />}>
                                        Pagar ahora
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Box>

            </Box>

        </ErrorBoundary>
    );
}
