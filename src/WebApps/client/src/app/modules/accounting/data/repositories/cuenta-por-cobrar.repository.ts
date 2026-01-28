import { Observable } from 'rxjs';
import { DataFilterCuentaPorCobrarResponse } from '@accounting/data/models/cuenta-por-cobrar.model';

export abstract class CuentaPorCobrarRepository {
  abstract getDataFilter(): Observable<DataFilterCuentaPorCobrarResponse>;
  abstract getAll<T>(obj: T): Observable<{ data: any[] }>;
  abstract getDataForm(idCuentaPorCobrar: number, idCliente: number): Observable<any>;
  abstract getCuotasById(idCuentaPorCobrar: number): Observable<any[]>;
}
