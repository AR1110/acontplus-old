import { ProductDataFormApi, DialogProps, ProductCreateDto, ProductPvPCreateDto, ProductReadDto, ProductState } from "@/modules/admin/models"

type Action =
    | { type: 'products', payload: ProductReadDto[] }
    | { type: 'dataFormApi', payload: ProductDataFormApi }
    | { type: 'data', payload: ProductCreateDto}
    | { type: 'productPvPs', payload: ProductPvPCreateDto[]}
    | { type: 'dialogTitle', payload: DialogProps}

export const ProductReducer = (state: ProductState, action: Action): ProductState => {
    switch (action.type) {
        case 'products':
            return {
                ...state,
                products: [...action.payload],
            }
        case 'dataFormApi':
            return {
                ...state,
                dataFormApi: action.payload
            } 
        case 'data': 
        console.log(action.payload)
            return {
                ...state,
                data: {...action.payload}
            }

        case 'productPvPs': 
            return {
                ...state,
                productPvPs: [...action.payload]
            }
        case 'dialogTitle': 
            return { 
                ...state, 
                dialogProps: {...action.payload}
            }
        default:
            return state;
    }
}
