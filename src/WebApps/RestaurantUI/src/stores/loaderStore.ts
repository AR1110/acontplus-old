import { create } from "zustand";


type State = {
    loading: boolean
    showLoader(isLoader: boolean): void
}
export const useLoaderStore = create<State>(set=>({
    loading: false,
    showLoader: (isLoader)=>set(state=>({
        loading: state.loading = isLoader
    }))
}))