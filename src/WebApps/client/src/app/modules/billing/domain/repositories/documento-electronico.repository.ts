import { Observable } from 'rxjs';
import { DocElectListResult, FilterData } from '@billing/domain/models/documento-electronico.model';
import { ApiResponse } from '@core/models/api-response';

export abstract class DocumentoElectronicoRepository {
  abstract authorize(id: number): Observable<ApiResponse>;
  abstract getFilters(forceRefresh: boolean): Observable<FilterData>;
  abstract refreshFilters(): Observable<FilterData>;
  abstract get filterData$(): Observable<FilterData | null>;
  abstract getAll<T>(parameters: T): Observable<DocElectListResult>;
  abstract cancel(id: number): Observable<ApiResponse>;
  abstract downloadXml(id: number): Observable<Blob>;
}
