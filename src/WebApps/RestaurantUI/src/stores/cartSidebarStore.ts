import { ItemRead } from '@/core/models'
import { produce } from 'immer'
import { create } from 'zustand'


type Medida = {
    idMedida: number
}
 
type StateCartSidebar = {
    index: number
    data: { pvps: ItemRead['pvps'] } & Partial<Omit<ItemRead, 'pvps'>>;
    openCartSidebar: boolean  
}

type Actions = {
    setOpenCartSidebar(open: boolean):void
    setDataItem(data:any, index: number):void
}


export const useStoreCartSidebar = create<StateCartSidebar & Actions>()((set) => ({
    index: 0,
    data: {
        pvps: []
    },
    openCartSidebar: false, 
    setDataItem(data, index){
        console.log(data)
        set(
            produce((state: StateCartSidebar) => {
                state.data = data;
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
