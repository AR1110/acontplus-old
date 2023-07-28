import { DataFormApi, ICategoryView, CategoryState } from "@/modules/admin/models";

type Action =
    | { type: 'list', payload: ICategoryView[] }
    | { type: 'dataFormApi', payload: DataFormApi }

export const CategoryReducer = (state: CategoryState, action: Action): CategoryState => {
   switch (action.type) {
      case 'list':
          return {
              ...state,
              subFamilia: [...action.payload],
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