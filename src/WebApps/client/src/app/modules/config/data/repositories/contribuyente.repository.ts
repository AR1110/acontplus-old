import { Contribuyente } from '@modules/config/data/models/wizard-config/contribuyente.model';
import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class ContribuyenteRepository {
  abstract save(contribuyente: Contribuyente): Observable<ApiResponseLegacy>;
}
