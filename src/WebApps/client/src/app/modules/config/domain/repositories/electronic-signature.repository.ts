import { Observable } from 'rxjs';
import {
  ElectronicSignatureListResponse,
  ElectronicSignatureParam,
} from '@modules/config/domain/models/electronic-signature.model';
import { ApiResponse } from '@core/models/api-response';

export abstract class ElectronicSignatureRepository {
  abstract list(): Observable<ElectronicSignatureListResponse>;
  abstract create(params: ElectronicSignatureParam): Observable<ApiResponse>;
  abstract update(params: Partial<ElectronicSignatureParam>): Observable<ApiResponse>;
  abstract updateSignature(params: Partial<ElectronicSignatureParam>): Observable<ApiResponse>;
  abstract downloadSignature(id: number): Observable<any>;
  abstract save(signature: ElectronicSignatureParam): Observable<ApiResponse>;
}
