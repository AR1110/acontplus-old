import { Observable } from 'rxjs';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface MassiveTaxRepository {
  getAll<T>(obj: T): Observable<any[]>;
  getDataForm(): Observable<{ taxRates: TarifaImpuesto[]; subCategories: any[] }>;
  getQuantityProductByTaxId<T>(obj: T): Observable<number>;
  put<T>(data: T): Observable<ApiResponseLegacy>;
}
