import { inject, Injectable } from '@angular/core';
import { LookupRepository } from '@restaurant/domain/repositories/lookup-repository';
import { map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/restaurant-const';
import { PagedResult, PaginationParams } from '@acontplus/core';
import { GetLookupsMapper } from '@restaurant/data/lookup/get-lookups-mapper';
import { LookupCache } from '@core/services/lookup-cache';
import { LookupType } from '@core/models/lookup-type';

@Injectable({
  providedIn: 'root',
})
export class LookupHttpRepository implements LookupRepository {
  #http = inject(HttpClient);
  #cache = inject(LookupCache);
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.LOOKUPS}`;
  getLookups(params: { type: LookupType; keys: string }): Observable<any> {
    const cachedContext = this.#cache.get(params.type);

    // 1. Si hay data en cache y tiene las keys pedidas -> devolverla
    if (cachedContext) {
      const filtered = this.#cache.getByKeys(params.type, params.keys);
      console.log(filtered);
      if (filtered) return of(filtered);
    }

    const queryParams = GetLookupsMapper.toJson(params.type);
    return this.#http.get<PagedResult<any>>(`${this.#url}?${queryParams}`).pipe(
      map((response) => GetLookupsMapper.fromJson(response)),
      tap((response) => this.#cache.set(params.type, response)), // Guardar todo
      map((response) => {
        const filtered = this.#cache.getByKeys(params.type, params.keys);
        console.log(filtered, 'fifdkdkd');
        return filtered ?? {};
      }),
    );
  }
}
