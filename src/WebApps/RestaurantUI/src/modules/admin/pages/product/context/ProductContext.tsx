// import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState} from 'react';
// import { DataFormApi, IProductView } from '@/modules/admin/models';
// import { ProductSvc } from '@/modules/admin/services';

import { ProductState } from "@/modules/admin/models";
import { createContext, useContext } from "react";

// //Main contract Interfaces Context
// export interface IProductContext {
// 	dataForm: DataFormApi | null,
// 	setDataForm:(dataForm: DataFormApi) => void
//     products: IProductView[]
// 	setProducts: Dispatch<SetStateAction<IProductView[]>>; 
// }

// //Definition context with values empty states
// export const ProductContext = createContext<IProductContext>({
// 	dataForm: null,
// 	setDataForm: () => null,
// 	products: [],
// 	setProducts: () => [], 
// });


// type ProductContextProps = {
// 	children: JSX.Element | JSX.Element[]
// }

// export const ProductProvider = ({ children }: ProductContextProps) => {
// 	const [dataForm, setDataForm] = useState<IProductContext["dataForm"] | null>(null);
// 	const [products, setProducts] = useState<IProductContext["products"]>([]); 

// 	const getProducts = () => {
// 		try {
// 			ProductSvc.getAll().then((response) => {
// 				setProducts(response);
// 			})
// 		} catch (error) { 
// 			console.log(error);
// 		}
// 	};

// 	const getDataForm = () => {
// 		try {
// 			ProductSvc.getDataForm().then(response=>{
// 				console.log(response);
// 			})
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	}

// 	useEffect(() => {
// 		getProducts();
// 		getDataForm();
// 	}, []);
 

// 	return (
// 		<ProductContext.Provider value={{
// 			dataForm,
// 			setDataForm,
// 			products,
// 			setProducts, 
// 		}}>
// 			{children}
// 		</ProductContext.Provider>
// 	);
// };

// export const useProductContext = ()=>{
// 	const context = useContext(ProductContext);
// 	if(context===undefined){
// 		throw new Error('ProductConext must be used within a ProductProvider');
// 	}
// 	return context;

// }

export type ProductContextProps = {
    productState: ProductState
}

export const ProductContext = createContext<ProductContextProps>({} as ProductContextProps);

export const useProductContext = ()=>{
	const context= useContext(ProductContext);
    console.log(context);
	if(context===undefined){
		throw new Error('ProductConext must be used within a ProductProvider');
	}
	return context;

}