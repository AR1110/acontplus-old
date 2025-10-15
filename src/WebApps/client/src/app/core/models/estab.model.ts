import { BodegaEstablecimiento } from './bodega.model';
import { PuntoEmisionEstablecimiento } from './punto-emision.model';

export interface Establecimiento {
  id?: number
  idEstab_Asig: number;
  codEstab_Asig: string;
  idUsuarioRol: number;
  codEstab: string;
  predeterminado: boolean;
  defaultEstab: boolean;
  usuario: string;
  idEstablecimiento: number;
  ruc: string;
  nombreComercial: string;
  estab: string;
  // obligadoContabilidad: "SI",
  // dirEstablecimiento: "direccion test",
  // contribuyenteRimpe: "CONTRIBUYENTE RÉGIMEN RIMPE",
  // actividad: "01",
  // ActividadEconomicaId: 2,
  // telefono: "0959889744",
  // correo: "sengua2017@gmail.com",
  idEntidad: number;
  entidad: string;
  rucEmpresa: string;
}

export interface GroupedEstabPuntoEmision
  extends Pick<PuntoEmisionEstablecimiento, 'idPuntoEmision' | 'ptoEmi' | 'defaultPtoEmi'> {}

export interface GroupedEstabBodega
  extends Pick<BodegaEstablecimiento, 'idBodega' | 'defaultBodega' | 'idEstablecimiento'> {
  descripcion: string;
}

export interface GroupedEstab
  extends Pick<
    Establecimiento,
    'id' | 'idEstablecimiento' | 'codEstab' | 'nombreComercial' | 'defaultEstab'
  > {
  nombreEstab: string;
  puntosEmision: GroupedEstabPuntoEmision[];
  bodegas: GroupedEstabBodega[];
  correo?: string;
}

export interface EstablecimientoSelectHtmlOnly
  extends Pick<
    Establecimiento,
    'idEstablecimiento' | 'codEstab' | 'nombreComercial' | 'predeterminado' | 'estab'
  > {}
