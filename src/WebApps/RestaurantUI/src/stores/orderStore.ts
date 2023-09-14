 
import { OrderFilter, OrderReadDto, orderFilter } from "@/core/models";
import { produce } from "immer";
import { create } from "zustand";
import { useLoaderStore } from ".";
import { orderService } from "@/core/services";
import { orderReadAdapter } from "@/core/adapters";


type State = {
    orderFilter: OrderFilter,
    orders: Array<OrderReadDto>
}

type Actions = {
    setOrders(orders: Array<OrderReadDto>): void
    getOrders():void
    setOrderFilter(orderFilter:OrderFilter):void
}

 
export const useOrderStore = create<State & Actions>((set, get)=>({
    orderFilter: orderFilter,
    orders: [],
    setOrders(orders) {
      
        set(
            produce((state:State)=>{
                state.orders = orders;
            })
        )
    },
    getOrders() {
        const showLoader =  useLoaderStore.getState().showLoader;
        showLoader(true)
        orderService.get(get().orderFilter).then(response => {  
                    
            set(
                produce((state:State)=>{
                    state.orders = orderReadAdapter(response.orders)
                })
            )
        }).finally(() => showLoader(false))
    },
    setOrderFilter(orderFilter){
        set(
            produce((state:State)=>{
                state.orderFilter = orderFilter;
            })
        )
    }

}))