import { Observable } from 'rxjs';
import {
  ElectronicSignatureListResponse,
  ElectronicSignatureParam,
} from '@modules/config/data/models/electronic-signature.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface ElectronicSignatureRepository {
  list(): Observable<ElectronicSignatureListResponse>;
  create(params: ElectronicSignatureParam): Observable<ApiResponseLegacy>;
  update(params: Partial<ElectronicSignatureParam>): Observable<ApiResponseLegacy>;
  updateSignature(params: Partial<ElectronicSignatureParam>): Observable<ApiResponseLegacy>;
  downloadSignature(id: number): Observable<any>;
  save(signature: ElectronicSignatureParam): Observable<ApiResponseLegacy>;
}
