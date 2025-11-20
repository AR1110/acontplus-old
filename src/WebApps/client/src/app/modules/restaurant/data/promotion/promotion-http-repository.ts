import {PaginationParams, PagedResult, ApiResponse} from "@acontplus/core";
import {inject, Injectable} from "@angular/core";
import { PromotionListDto} from "@modules/restaurant/domain/models/promotion";
import {PromotionRepository} from "@restaurant/domain/repositories/promotion-repository";
import {map, Observable} from "rxjs";
import {PATHS_API} from "@core/constants/global.constants";
import {RESTAURANT_PATHS} from "@restaurant/domain/enums/restaurant.enum";
import {HttpClient} from "@angular/common/http";
import {PromotionListMapper} from "@restaurant/data/promotion/promotion-list-mapper";
import {PromotionInsertMapper} from "@restaurant/data/promotion/promotion-insert-mapper";
import {PromotionGetByIdMapper} from "@restaurant/data/promotion/promotion-get-by-id-mapper";

@Injectable({
  providedIn: "root"
})
export class PromotionHttpRepository implements PromotionRepository {

   #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.PROMOTIONS}`;
   #http = inject(HttpClient);

    list(params: PaginationParams): Observable<PagedResult<PromotionListDto>> {
      const queryParams = PromotionListMapper.toJson(params);
      console.log(queryParams, 'list promotions')
      return this.#http
        .get<PagedResult<unknown>>(`${this.#url}?${queryParams}`)
        .pipe(map((response) => PromotionListMapper.fromJson(response)));
    }

   insert(data: any): Observable<any> {
      const params = PromotionInsertMapper.toJson(data);
    return this.#http.post(`${this.#url}`, params);
  }

    getById(id: number): Observable<any> {
    return this.#http.get(`${this.#url}/${id}`).pipe(
      map((response) => PromotionGetByIdMapper.fromJson(response))
    )
  }


}
