import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  GuiaRemisionDataForm,
  GuiaRemisionFilterData,
  GuiasRemisionResponse,
} from '@billing/domain/models/guia-remision/guia-remision.model';

export abstract class GuiaRemisionRepository {
  abstract getFormData(): Observable<GuiaRemisionDataForm>;
  abstract getFilterData(): Observable<GuiaRemisionFilterData>;
  abstract list<T>(parameters: T): Observable<GuiasRemisionResponse>;
  // abstract getById(id: number): Observable<any>;
  // abstract create(infrastructure: Partial<any>): Observable<any>;
  // abstract update(infrastructure: any): Observable<any>;
  // abstract delete(id: number): Observable<void>;
}
