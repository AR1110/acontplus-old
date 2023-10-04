import { writable, get } from "svelte/store";
import { hideLoader } from '$lib/utils/loading-spinner';
import { categoryService } from "../services/category.service";
import { showLoader } from "$utils/loading-spinner";
import tS from "$utils/toast";
import { productService } from "../services/product.service";

//Start Tech Spec 
type Data = {
    customerCompanyId: number
}

type State = {
    data: Data
}
//End Tech Spec 

//Start Product 
type Category = {
    code: string
    name: string
    id: number
}

type Product = {
    id: number
    categoryId: number
    name: string
    serie: string
    marca: string
    model: string
    year: number
    warranty: number
    color: string
    specs: object
}
//End product 




type ProductState = {
    categories: Array<Category>,
    dataProduct: Product
}
 
const initialState: State = {
    data: {
        customerCompanyId: 0
    },
}

const initialProductState: ProductState = {
    categories: [],
    dataProduct: {
        id: 0,
        categoryId: 0,
        name: '',
        serie: '',
        marca: '',
        model: '',
        year: 0,
        warranty: 0,
        color: '',
        specs: {}
    }
}

export const techSpecStore = writable<State & ProductState>({ ...initialState, ...initialProductState });

export const setCustomerCompanyId = (id) => {
    techSpecStore.update(state => {
        state.data.customerCompanyId = id;
        return state;
    })
}

export const initiload = async () => {
    try {
        showLoader();
        const categories = await categoryService.get()
        techSpecStore.update(state => {
            state.categories = categories;
            return state;
        })
        hideLoader();
    } catch (error) {
        console.log(error)
    }
}

export const saveProduct = ()=>{
    try {
        const {dataProduct} = get(techSpecStore)

        if((dataProduct.categoryId>0)){
            tS({
                type: 'warning',
                message: 'Seleccione la Categoría'
            })
            return
        }

        if(!dataProduct.name || dataProduct.name===""){
            tS({
                type: 'warning',
                message: 'Ingrese el nombre del Producto'
            })
            return
        }

        if(!dataProduct.serie || dataProduct.serie===""){
            tS({
                type: 'warning',
                message: 'Ingrese el IMEI/SERIE'
            })
            return
        }

         

    } catch (error) {
        console.log(error)
    }
}