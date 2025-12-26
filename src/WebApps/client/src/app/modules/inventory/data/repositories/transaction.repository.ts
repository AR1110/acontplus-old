import { Observable } from 'rxjs';
import { GroupedEstab } from '@core/models/estab.model';

export interface TransactionRepository {
  getDataFilter(): Observable<{ estabs: GroupedEstab[]; tiposTransaccion: any[] }>;
  getDataKardex<T>(obj: T): Observable<{ dataArticulo: any; kardex: any[] }>;
}
