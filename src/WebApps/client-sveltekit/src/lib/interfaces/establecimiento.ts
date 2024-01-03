 
import type { PuntoEmision } from "./punto-emision";

export type Establecimiento = {
    idEstablecimiento: number;
    nombreComercial: string;
    codEstab: string;
    defaultEstab: boolean;
    puntosEmision: Array<PuntoEmision>;
};