import { useEffect, useReducer } from "react"; 
import { DataFormApi, ProductState } from "@/modules/admin/models"; 
import { ProductReducer } from "./ProductReducer";
import { ProductContext } from "./ProductContext";
import { ProductSvc } from "@/modules/admin/services";
 

 const INITIAL_STATE: ProductState = {
     products: [],
     dataFormApi: {
        categories: [],
        measures: [],  
        saleFees:[], 
        vatRates: []

     } as DataFormApi
 } 

interface Props {
    children: JSX.Element | JSX.Element[]
}
export const ProductProvider = ({children}: Props) => {
    const [productState, dispatch] = useReducer(ProductReducer, INITIAL_STATE)
     
    const getProducts = () => {
		try {
			ProductSvc.getAll().then((response) => {
				dispatch({ 
                    type: 'list',
                    payload: response
                })
			})
		} catch (error) { 
			console.log(error);
		}
	};

	const getDataForm = () => {
		try {
			ProductSvc.getDataForm().then(response=>{
				dispatch({
                    type: 'dataFormApi',
                    payload: response
                })
			})
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getProducts();
		getDataForm();
	}, []);
 
  return (
    <ProductContext.Provider value={{productState}}>
        {children}
    </ProductContext.Provider>
  )
}
 