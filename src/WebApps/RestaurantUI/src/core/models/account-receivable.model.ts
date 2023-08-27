export interface QueryParams {
    idDocumento: number
    idTipoDocumento: number
    codEstab: string
    tiempoCredito: number
    idCliente: number
    codDoc: 'NE' | 'FV';
    idCuentaPorCobrar: number
    payAutomatic: boolean
    printerAutomatic: boolean
}

export const queryParamsInitialState: QueryParams = {
    idDocumento: 0,
    idTipoDocumento: 0,
    codEstab: "",
    tiempoCredito: 0,
    idCliente: 0,
    codDoc: "NE",
    idCuentaPorCobrar: 0,
    payAutomatic: false,
    printerAutomatic: false
}