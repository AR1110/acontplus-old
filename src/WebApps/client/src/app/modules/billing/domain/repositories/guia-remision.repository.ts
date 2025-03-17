import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import {
  GuiaRemisionDataForm,
  GuiaRemisionFilterData,
  GuiasRemisionResponse,
} from '@billing/domain/models/guia-remision.model';

export abstract class GuiaRemisionRepository {
  abstract getFormData(): Observable<ApiResponse<GuiaRemisionDataForm>>;
  abstract getFilterData(): Observable<GuiaRemisionFilterData>;
  abstract list<T>(parameters: T): Observable<GuiasRemisionResponse>;
  // abstract getById(id: number): Observable<any>;
  // abstract create(data: Partial<any>): Observable<any>;
  // abstract update(data: any): Observable<any>;
  // abstract delete(id: number): Observable<void>;
}
