import { writable } from "svelte/store";


type State = {
    data: any
}

const initialState: State = {
    data: {}
}

export const techSpecStore = writable<State>(initialState);