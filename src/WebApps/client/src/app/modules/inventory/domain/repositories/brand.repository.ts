import { Product } from '@inventory/product/domain/entities/product.entity';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

export abstract class BrandRepository {
  abstract getAll<T>(obj: T): Observable<any>;
  abstract post<T>(obj: T): Observable<ApiResponse>;
  abstract put<T>(id: number, obj: T): Observable<ApiResponse>;
  abstract updateStatus(id: number): Observable<ApiResponse>;
}
