 
import { ProductState } from "@/modules/admin/models";
import { createContext, useContext } from "react"; 

export type ProductContextProps = {
    productState: ProductState
}

export const ProductContext = createContext<ProductContextProps>({} as ProductContextProps);

export const useProductContext = ()=>{
	const context= useContext(ProductContext);
    console.log(context);
	if(context===undefined){
		throw new Error('El contexto del producto debe usarse dentro de un proveedor de productos');
	}
	return context;

}