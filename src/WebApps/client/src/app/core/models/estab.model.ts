import { IBodegaEstablecimiento } from "./bodega.model"
import { IPuntoEmisionEstablecimiento } from "./punto-emision.model"

 


export interface Establecimiento {
    idEstab_Asig: number
    codEstab_Asig: string
    idUsuarioRol: number,
    codEstab: string
    predeterminado: boolean
    defaultEstab: boolean
    usuario: string
    idEstablecimiento: number
    ruc: string
    nombreComercial: string
    estab: string,
    // obligadoContabilidad: "SI",
    // dirEstablecimiento: "direccion test",
    // contribuyenteRimpe: "CONTRIBUYENTE RÉGIMEN RIMPE",
    // actividad: "01",
    // ActividadEconomicaId: 2,
    // telefono: "0959889744",
    // correo: "sengua2017@gmail.com",
    idEntidad: number,
    entidad: string,
    rucEmpresa: string
}
 

export interface GroupedEstab extends Pick<Establecimiento, "idEstablecimiento" | "codEstab" | "nombreComercial" | "defaultEstab"> {
    puntosEmision: Array<Pick<IPuntoEmisionEstablecimiento, "idPuntoEmision" | "ptoEmi" | "defaultPtoEmi">>
    bodegas?: Array<Pick<IBodegaEstablecimiento, "idBodega"| "bodega" | "defaultBodega">>
} 