import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Import by developer.
import { LookUpRepository } from '../repositories/lookup-repositoriy';
import { HttpClient } from '@angular/common/http';
import { PATHS_API } from '@core/constants/global.constants';
import { PURCHASE_PATHS } from '@modules/purchases/purchases.const';
import { LookupType } from '@core/models/lookup-type';
import { PagedResult } from '@acontplus/core';
import { map } from 'rxjs';
import { PurchaseLookupsMapper } from '../mappers/purchase-lookup-mapper';

@Injectable({
  providedIn: 'root',
})
export class LookUpHttp implements LookUpRepository {
  #http = inject(HttpClient);
  #url = `${PATHS_API.PURCHASE}${PURCHASE_PATHS.LOOKUPS}`;

  getLookup(params: { type: LookupType; keys: string }): Observable<any> {
    const queryParams = PurchaseLookupsMapper.toJson(params.type);

    return this.#http
      .get<PagedResult<any>>(`${this.#url}?${queryParams}`)
      .pipe(map((response) => PurchaseLookupsMapper.fromJson(response)));
  }
}
