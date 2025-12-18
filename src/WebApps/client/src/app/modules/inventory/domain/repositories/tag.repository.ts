import { Product } from '@inventory/domain/models/product.entity';
import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class TagRepository {
  abstract getAll<T>(obj: T): Observable<any>;
  abstract post<T>(obj: T): Observable<ApiResponseLegacy>;
  abstract put<T>(id: number, obj: T): Observable<ApiResponseLegacy>;
  abstract updateStatus(id: number): Observable<ApiResponseLegacy>;
}
