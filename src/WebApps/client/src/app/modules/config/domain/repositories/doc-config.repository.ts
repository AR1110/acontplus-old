import {Observable} from "rxjs";
import {
  DocConfigFormDataResponse,
  DocConfigInfoAdicional,
  DocConfigListResponse
} from "@modules/config/domain/models/doc-config.model";
import {ApiResponse} from "@core/models/api-response";

export abstract class DocConfigRepository {
  abstract list(puntoEmisionId:number):Observable<DocConfigListResponse>
  abstract getInfoAdicionales(id:number):Observable<DocConfigInfoAdicional[]>
  abstract create(params:any): Observable<ApiResponse>
  abstract getFormData(): Observable<DocConfigFormDataResponse>
}
