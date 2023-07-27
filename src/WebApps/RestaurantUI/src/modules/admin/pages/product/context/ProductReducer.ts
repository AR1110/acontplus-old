import { DataFormApi, IProductView, ProductState } from "@/modules/admin/models"

type Action =
    | { type: 'list', payload: IProductView[] }
    | { type: 'dataFormApi', payload: DataFormApi }

export const ProductReducer = (state: ProductState, action: Action): ProductState => {
    switch (action.type) {
        case 'list':
            return {
                ...state,
                products: [...action.payload],
            }
        case 'dataFormApi':
            return {
                ...state,
                dataFormApi: action.payload
            }  
        default:
            return state;
    }
}
