import { ItemRead } from '@/core/models'
import { produce } from 'immer'
import { create } from 'zustand'


type Medida = {
    idMedida: number
}
 
type StateCartSidebar = {
    index: number
    data: { 
        pvps: ItemRead['pvps'],
        measures: ItemRead['measures'] 
    } & Partial<Omit<ItemRead, 'pvps' | 'measures'>>;
    openCartSidebar: boolean  
}

type Actions = {
    setOpenCartSidebar(open: boolean):void
    setDataItem(data:any, index: number):void
}


export const useStoreCartSidebar = create<StateCartSidebar & Actions>()((set) => ({
    index: 0,
    data: {
        pvps: [],
        measures: []
    },
    openCartSidebar: false, 
    setDataItem(data, index){  
        set(
            produce((state: StateCartSidebar) => {
                state.data = structuredClone(data);
                state.index = index;
            })
        )
    },
    setOpenCartSidebar(open) {
        set(
            produce((state: StateCartSidebar) => {
                state.openCartSidebar = open;
            })
        )
    },
}))
