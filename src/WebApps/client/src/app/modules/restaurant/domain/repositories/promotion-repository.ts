import { PagedResult, PaginationParams } from '@acontplus/core';
import { Observable } from 'rxjs';
import { PromotionListDto } from '@restaurant/domain/models/promotion';

export abstract class PromotionRepository {
  abstract list(params: PaginationParams): Observable<PagedResult<PromotionListDto>>;
  abstract insert(data: any): Observable<any>;
  abstract update(params: any): Observable<any>;
  abstract getById(id: number): Observable<any>;
}
