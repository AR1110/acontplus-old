import { writable } from "svelte/store";

type Data = {
    customerCompanyId: number
}

type State = {
    data: Data
}

const initialState: State = {
    data: {
        customerCompanyId: 0
    }
}

export const techSpecStore = writable<State>(initialState);

export const setCustomerCompanyId = (id) => {
    techSpecStore.update(state => {
        state.data.customerCompanyId = id;
        return state;
    })
}