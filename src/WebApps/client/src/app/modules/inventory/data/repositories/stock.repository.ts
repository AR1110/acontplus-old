import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface StockRepository {
  put(productId: number): Observable<ApiResponseLegacy>;
}
