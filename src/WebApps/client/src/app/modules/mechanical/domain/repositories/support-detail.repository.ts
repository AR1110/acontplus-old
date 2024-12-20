import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";

export abstract class SupportDetailRepository {
  abstract getId(id: number, loader?: boolean):Observable<any>

  abstract  post<T>(data: T): Observable<ApiResponse>
}
