import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";

export abstract class SubCategoryRepository {
  abstract getAll<T>(obj:T): Observable<any[]>;
  abstract getDataForm(): Observable<{ categories: any[] }>
  abstract create<T>(data: T): Observable<ApiResponse>;
  abstract update<T>(id: number, data: T): Observable<ApiResponse>;
  abstract delete(id: number): Observable<ApiResponse>;
}
