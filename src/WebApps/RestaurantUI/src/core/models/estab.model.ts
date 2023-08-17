export interface Establecimiento {
    codEstab_Asig: string;
    idUsuarioRol: string;
    codEstab: string;
    predeterminado: boolean;
    idEstablecimiento: number;
    ruc: number;
    nombreComercial: string;
    estab: number;
    obligadoContabilidad: string;
    dirEstablecimiento: string;
    contribuyenteRimpe: string;
    actividad: string;
}

export const estabInitialState: Establecimiento = {
    codEstab_Asig: "",
    idUsuarioRol: "",
    codEstab: "",
    predeterminado: false,
    idEstablecimiento: 0,
    ruc: 0,
    nombreComercial: "",
    estab: 0,
    obligadoContabilidad: "",
    dirEstablecimiento: "",
    contribuyenteRimpe: "",
    actividad: ""
}