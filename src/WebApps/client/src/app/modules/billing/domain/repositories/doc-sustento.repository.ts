import { Observable } from 'rxjs';
import { RetencionAts } from '@billing/domain/models/retencion-ats/retencion-ats.model';
import { RetAtsDocSustento } from '@billing/domain/models/retencion-ats/ret-ats-doc-sustento.model';
import { ApiResponse } from '@core/models/api-response';

export abstract class DocSustentoRepository {
  abstract getTaxes(parameters: unknown): Observable<{
    doc: [];
    taxes: [];
    payments: [];
  }>;
  abstract getById(id: number): Observable<RetAtsDocSustento>;
  abstract create(data: RetencionAts): Observable<RetAtsDocSustento>;
  abstract update(data: RetencionAts): Observable<RetAtsDocSustento>;
  abstract delete(id: number): Observable<ApiResponse>;
}
