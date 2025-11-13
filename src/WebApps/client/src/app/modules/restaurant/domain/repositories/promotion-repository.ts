import {PagedResult, PaginationParams } from "@acontplus/core";
import {Observable} from "rxjs";
import {PromotionList} from "@restaurant/domain/models/promotion";

export interface PromotionRepository {
  list(params: PaginationParams): Observable<PagedResult<PromotionList>>
}
