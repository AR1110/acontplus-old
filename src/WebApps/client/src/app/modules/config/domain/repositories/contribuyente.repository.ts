import { Contribuyente } from '../models/wizard-config/contribuyente.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

export abstract class ContribuyenteRepository {
  abstract save(contribuyente: Contribuyente): Observable<ApiResponse>;
}
