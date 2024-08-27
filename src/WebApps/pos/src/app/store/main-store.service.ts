import { Injectable } from '@angular/core';
import {GenericStoreSignalService} from "@/services/generic-store-signal.service";
import {GroupedEstab, GroupedEstabBodega, GroupedEstabPuntoEmision} from '@/models/estab.model';

type MainStoreState = {
  isRoutePos: boolean
  entidadName: string
  dataEstab: GroupedEstab
  userName: string,
  establecimientos: GroupedEstab[]
  puntosEmision: GroupedEstabPuntoEmision[]
  bodegas: GroupedEstabBodega[]
  codEstab: string
  establecimientoId: number
  bodegaId: number
  puntoEmisionId: number
}
@Injectable({
  providedIn: 'root'
})
export class MainStoreService extends GenericStoreSignalService<MainStoreState> {
  constructor() {
    super();
  }
}

