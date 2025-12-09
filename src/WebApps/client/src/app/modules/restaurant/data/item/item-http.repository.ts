import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/domain/enums/restaurant.enum';
import { HttpClient } from '@angular/common/http';
import { ItemRepository } from '@restaurant/domain/repositories/item.repository';
import { map, Observable, throwError } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ItemListMapper } from '@restaurant/data/item/item-list.mapper';
import { PagedResult, PaginationParams } from '@acontplus/core';
import { ItemUpdateMapper } from '@restaurant/data/item/item-update-mapper';
import { ItemGetByIdMapper } from '@restaurant/data/item/item-get-by-id-mapper';
import { ItemComboUpdateMapper } from '@restaurant/data/item/item-combo-update-mapper';

@Injectable({
  providedIn: 'root',
})
export class ItemHttpRepository implements ItemRepository {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.ITEM}`;
  #http = inject(HttpClient);

  list(params: PaginationParams): Observable<PagedResult<any>> {
    const queryParams = ItemListMapper.toJson(params);
    return this.#http
      .get<PagedResult<any>>(`${this.#url}?${queryParams}`)
      .pipe(map((response) => ItemListMapper.fromJson(response)));
  }

  search(params: any): Observable<PagedResult<any>> {
    const json = ItemListMapper.toJson(params);
    return this.#http
      .get<PagedResult<any>>(`${this.#url}?json=${json}`)
      .pipe(map((response) => ItemListMapper.fromJson(response)));
  }

  getById(id: number): Observable<any> {
    return this.#http
      .get(`${this.#url}/${id}`)
      .pipe(map((response) => ItemGetByIdMapper.fromJson(response)));
  }

  update(id: number, data: any): Observable<any> {
    let params;
    if (data.isProduct) {
      params = ItemUpdateMapper.toJson(data);
    }
    if (data.isCombo) {
      params = ItemComboUpdateMapper.toJson(data);
    }
    if (!params) {
      throwError(() => new Error('Invalid data'));
    }
    return this.#http.put(`${this.#url}/${id}`, params);
  }
}
