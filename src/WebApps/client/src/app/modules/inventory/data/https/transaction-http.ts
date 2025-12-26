import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '@inventory/inventory.const';
import { TransactionRepository } from '../repositories/transaction.repository';
import { groupEstabUtil } from '@core/utils/group-estab.util';

@Injectable()
export class TransactionHttp implements TransactionRepository {
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.TRANSACTION}`;
  private http = inject(HttpClient);

  getDataFilter(): Observable<{ estabs: any[]; tiposTransaccion: any[] }> {
    const json = JSON.stringify({
      tipo: 3,
    });
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        return {
          estabs: groupEstabUtil({
            bodegas: response.bodegas,
            isGroupBodega: true,
          }),
          tiposTransaccion: response.tipoTransaccion,
        };
      }),
    );
  }

  getDataKardex<T>(obj: T): Observable<{ dataArticulo: any; kardex: any[] }> {
    const json = JSON.stringify({ ...obj, tipo: 2 });

    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        return {
          dataArticulo: response.dataArticulo[0],
          kardex: response.kardex,
        };
      }),
    );
  }
}
