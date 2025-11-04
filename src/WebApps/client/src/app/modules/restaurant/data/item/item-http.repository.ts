import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/domain/enums/restaurant.enum';
import { HttpClient } from '@angular/common/http';
import { ItemRepository } from '@restaurant/domain/repositories/item.repository';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { ItemListMapper } from '@restaurant/data/item/item-list.mapper';

@Injectable({
  providedIn: 'root',
})
export class ItemHttpRepository implements ItemRepository {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.ITEM}`;
  #http = inject(HttpClient);

  list(params: any): Observable<any> {
    const json = ItemListMapper.toJson(params);
    return this.#http
      .get<ApiResponse>(`${this.#url}?json=${json}`)
      .pipe(map((response) => ItemListMapper.fromJson(response)));
  }
}
