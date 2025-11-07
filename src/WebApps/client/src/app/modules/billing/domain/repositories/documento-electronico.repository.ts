import { Observable } from 'rxjs';
import { DocElectListResult, FilterData } from '@billing/domain/models/documento-electronico.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class DocumentoElectronicoRepository {
  abstract authorize(id: number): Observable<ApiResponseLegacy>;
  abstract getFilters(forceRefresh: boolean): Observable<FilterData>;
  abstract refreshFilters(): Observable<FilterData>;
  abstract get filterData$(): Observable<FilterData | null>;
  abstract getAll<T>(parameters: T): Observable<DocElectListResult>;
  abstract cancel(id: number): Observable<ApiResponseLegacy>;
  abstract downloadXml(id: number): Observable<Blob>;
}
