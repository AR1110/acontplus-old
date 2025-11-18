import { PaginationParams, PagedResult } from "@acontplus/core";
import {inject, Injectable} from "@angular/core";
import {PromotionList} from "@modules/restaurant/domain/models/promotion";
import {PromotionRepository} from "@restaurant/domain/repositories/promotion-repository";
import {map, Observable} from "rxjs";
import {PATHS_API} from "@core/constants/global.constants";
import {RESTAURANT_PATHS} from "@restaurant/domain/enums/restaurant.enum";
import {HttpClient} from "@angular/common/http";
import {PromotionListMapper} from "@restaurant/data/promotion/promotion-list-mapper";

@Injectable({
  providedIn: "root"
})
export class PromotionHttpRepository implements PromotionRepository {
   #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.PROMOTIONS}`;
   #http = inject(HttpClient);

    list(params: PaginationParams): Observable<PagedResult<PromotionList>> {
      const queryParams = PromotionListMapper.toJson(params);
      return this.#http
        .get<PagedResult<unknown>>(`${this.#url}?${queryParams}`)
        .pipe(map((response) => PromotionListMapper.fromJson(response)));
    }

}
