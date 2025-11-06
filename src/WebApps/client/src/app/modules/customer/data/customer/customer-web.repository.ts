import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map } from 'rxjs';
import { CustomerRepository } from '@customer/domain/repositories/customer.repository';

@Injectable({
  providedIn: 'root',
})
export class CustomerWebRepository extends CustomerRepository {
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.ANTICIPO}`;
  private _http = inject(HttpClient);

  constructor() {
    super();
  }

  getAll<T>(obj: T) {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });

    return this._http.get<ApiResponseLegacy>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        if (response.code === '1') {
        }
        return [];
      }),
    );
  }
}
