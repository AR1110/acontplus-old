import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import { productService } from '@/core/services';
import { ProductSearchDto } from '@/core/models';
import { productSearchAdapter } from '@/core/adapters';
import { Avatar, Grid, Typography } from '@mui/material';
import product_default from '/assets/images/imgProductDefault.png';

type ProductSearchProps = {
  onChangeProductSearch(id: number): void
}

const ProductSearch = ({ onChangeProductSearch }: ProductSearchProps) => {
  const [products, setProducts] = useState<Array<ProductSearchDto>>([])

  let controller: AbortController;

  const search = async (_p: any, value: string) => {
    try {
      if (value.length < 2) return

      // Intentamos realizar una búsqueda de productos utilizando un servicio llamado 'productService'
      // pasando la cadena de búsqueda 'value' como parámetro.
      const dataFetch = productService.search({ busqueda: value });

      // Si ya existe un controlador de solicitud activo (abortController), lo abortamos.
      if (controller) controller.abort();

      // Establecemos el nuevo controlador de solicitud para esta búsqueda.
      controller = dataFetch.controller;


      // Realizamos la llamada a la búsqueda utilizando 'dataFetch.call' y esperamos su resultado.
      const resultAxios = await dataFetch.call;

      // Extraemos los datos de la respuesta Axios.
      const response = resultAxios.data;

      // mapea los datos de la API al modelo de la aplicación y devuelve un arreglo de productos.
      const mappedProducts = productSearchAdapter(JSON.parse(response.payload) || []);

      // Establecemos los productos resultantes 
      setProducts(mappedProducts);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    return () => {
      controller && controller.abort();
    }
  }, [])

  return (
    <Autocomplete
      id="productSearch"
      onInputChange={search}
      options={products}
      selectOnFocus
      clearOnBlur 
      freeSolo
      getOptionLabel={(option) => typeof option === 'string' ? option : option.description}
      onChange={(_, value) => {
        if (!(typeof value === 'string')) {
          onChangeProductSearch(value?.productId ?? 0)
        }
      }}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Grid container alignItems="center">
            <Grid item sx={{ display: 'flex', width: 44 }}>
              <Avatar
                alt="Product"
                src={product_default}

              />
            </Grid>
            <Grid item>
              <Box component="span">
                <Typography variant="subtitle2" gutterBottom>
                  {option.description}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {option.code} - {option.iva}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Buscar el Producto"
          inputProps={{
            ...params.inputProps
          }}
        />
      )}
    />
  );
}

export default ProductSearch;

