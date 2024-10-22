import { BodegaEstablecimiento } from "./bodega.model"
import { PuntoEmisionEstablecimiento } from "./punto-emision.model"


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



export interface GroupedEstabPuntoEmision extends Pick<PuntoEmisionEstablecimiento, "idPuntoEmision" | "ptoEmi" | "defaultPtoEmi"> { }

export interface GroupedEstabBodega extends Pick<BodegaEstablecimiento, "idBodega" | "defaultBodega"> {
  descripcion: string
}

export interface GroupedEstab extends Pick<Establecimiento, "idEstablecimiento" | "codEstab" | "nombreComercial" | "defaultEstab"> {
  name:string
  puntosEmision: Array<GroupedEstabPuntoEmision>
  bodegas: Array<GroupedEstabBodega>
}
