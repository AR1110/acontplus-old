import { Injectable } from '@angular/core';
import {
  GroupedEstab,
  GroupedEstabBodega,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import { GenericStoreSignalService } from '@shared/services/generic-store-signal.service';

interface RestaurantStoreState {
  dataEstab: GroupedEstab;
  userName: string;
  establecimientos: GroupedEstab[];
  puntosEmision: GroupedEstabPuntoEmision[];
  bodegas: GroupedEstabBodega[];
  codEstab: string;
  establecimientoId: number;
  bodegaId: number;
  puntoEmisionId: number;
}
@Injectable({
  providedIn: 'root',
})
export class RestaurantStoreService extends GenericStoreSignalService<RestaurantStoreState> {
  constructor() {
    super();
  }
}
