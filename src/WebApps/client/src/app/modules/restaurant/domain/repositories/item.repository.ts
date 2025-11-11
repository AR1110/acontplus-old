import { Observable } from 'rxjs';
import { PagedResult, PaginationParams } from '@acontplus/core';

export abstract class ItemRepository {
  abstract list(params: PaginationParams): Observable<PagedResult<any>>;
  abstract search(params: any): Observable<PagedResult<any>>;
  abstract getById(id: number): Observable<any>;
  abstract update(id: number, data: any): Observable<any>;
}
