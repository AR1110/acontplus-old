import { DataFormApi, DialogProps, ProductCreateDto, ProductPvPCreateDto, ProductReadDto, ProductState } from "@/modules/admin/models"

type Action =
    | { type: 'list', payload: ProductReadDto[] }
    | { type: 'dataFormApi', payload: DataFormApi }
    | { type: 'data', payload: ProductCreateDto}
    | { type: 'productPvPs', payload: ProductPvPCreateDto[]}
    | { type: 'dialogTitle', payload: DialogProps}

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
        case 'data': 
            return {
                ...state,
                data: action.payload
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
