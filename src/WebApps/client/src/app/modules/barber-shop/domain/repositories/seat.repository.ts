import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";

export abstract class SeatRepository {
  abstract list():Observable<any>;
  // abstract create(): Observable<ApiResponse>;
  // abstract update(): Observable<ApiResponse>;
  // abstract remove(): Observable<ApiResponse>;

}
