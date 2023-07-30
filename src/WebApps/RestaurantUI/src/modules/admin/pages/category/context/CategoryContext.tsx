import { CategoryState } from "@/modules/admin/models";
import { createContext, useContext } from "react";

export type CategoryContextProps = {
   categoryState: CategoryState
}

export const CategoryContext = createContext<CategoryContextProps>({} as CategoryContextProps);

export const useCategoryContext = ()=>{
  const context= useContext(CategoryContext);
   console.log(context);
  if(context===undefined){
     throw new Error('El contexto del producto debe usarse dentro de un proveedor de productos');
  }
  return context;
}