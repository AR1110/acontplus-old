import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface ProductBarcodeRepository {
   post<T>(obj: T, file?: Blob): Observable<ApiResponseLegacy>;
   put<T>(id: number, obj: T): Observable<ApiResponseLegacy>;
   remove(id: number): Observable<ApiResponseLegacy>;
}
