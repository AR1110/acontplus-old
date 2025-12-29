import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

// Import by developer.
import { LookUpRepository } from '../repositories/lookup-repositoriy';
import { HttpClient } from '@angular/common/http';
import { PATHS_API } from '@core/constants/global.constants';
import { PURCHASE_PATHS } from '@modules/purchases/purchases.const';
import { LookupType } from '@core/models/lookup-type';
import { PagedResult } from '@acontplus/core';
import { PurchaseLookupsMapper } from '../mappers/purchase-lookup-mapper';
import { PurchaseLookupResponse } from '../models/purchase-lookup';

@Injectable({
  providedIn: 'root',
})
export class LookUpHttp implements LookUpRepository {
  #http = inject(HttpClient);
  #url = `${PATHS_API.PURCHASE}${PURCHASE_PATHS.LOOKUPS}`;

  getLookup(params: LookupType): Observable<PurchaseLookupResponse> {
    const queryParams = PurchaseLookupsMapper.toJson(params);

    return this.#http
      .get<PagedResult<any>>(`${this.#url}?${queryParams}`)
      .pipe(map((response) => PurchaseLookupsMapper.fromJson(response)));
  }
}
