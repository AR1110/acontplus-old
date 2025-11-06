import { Observable } from 'rxjs';
import {
  ElectronicSignatureListResponse,
  ElectronicSignatureParam,
} from '@modules/config/domain/models/electronic-signature.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class ElectronicSignatureRepository {
  abstract list(): Observable<ElectronicSignatureListResponse>;
  abstract create(params: ElectronicSignatureParam): Observable<ApiResponseLegacy>;
  abstract update(params: Partial<ElectronicSignatureParam>): Observable<ApiResponseLegacy>;
  abstract updateSignature(
    params: Partial<ElectronicSignatureParam>,
  ): Observable<ApiResponseLegacy>;
  abstract downloadSignature(id: number): Observable<any>;
  abstract save(signature: ElectronicSignatureParam): Observable<ApiResponseLegacy>;
}
