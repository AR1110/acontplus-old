
import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";


export abstract class ProductBarcodeRepository {

  abstract post<T>(obj:T, file?:Blob): Observable<ApiResponse>;
  abstract put<T>(id:number, obj:T): Observable<ApiResponse>;
  abstract remove(id:number): Observable<ApiResponse>;
}
