import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  CreditTimeList,
  ListCreditTimeResponse,
} from '@modules/config/data/models/tiempo-credito.model';

export abstract class CreditTimeRepository {
  abstract list(params: any): Observable<ListCreditTimeResponse>;
  abstract create(params: any): Observable<ApiResponseLegacy>;
  abstract update(params: any): Observable<ApiResponseLegacy>;
  abstract delete(params: Partial<CreditTimeList>): Observable<ApiResponseLegacy>;
}
