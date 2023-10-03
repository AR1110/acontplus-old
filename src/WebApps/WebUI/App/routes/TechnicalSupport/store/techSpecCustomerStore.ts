
import { writable } from "svelte/store";

type TipoIdentificacion = {
    codigoSri: "04" | "05" | "06",
    codigo: "C" | "R" | "P",
    idTipoIdentificacion: number,
    descripcion: string
}

type TipoContribuyente = {
    idSubContribuyente: 7,
    descripcion: string
    codigo: "01" | "02" | "03" | "04" | "05" | "06"
}

type TiempoCredito = {
    idTiempoCredito: number
    descripcion: string
    diasCredito: number,
}
type DataForm = {
    tiposIdentificacion: Array<TipoIdentificacion>
    tipoContribuyente: Array<TipoContribuyente>
    tiempoCreditos: Array<TiempoCredito>
}

type State = {
    showForm: boolean
    dataForm: DataForm
}

const initialState: State = {
    showForm: false,
    dataForm: {
        tiposIdentificacion: [],
        tipoContribuyente: [],
        tiempoCreditos: []
    }
}

export const techSpecCustomerStore = writable<State>(initialState);

export const activeShowForm = () => {
    techSpecCustomerStore.update(state => ({
        ...state,
        showForm: !state.showForm
    }))
}