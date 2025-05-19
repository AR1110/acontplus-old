import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";
import {ListCreditTimeResponse} from "@modules/config/domain/models/tiempo-credito.model";

export abstract class CreditTimeRepository {
  abstract list(params:any):Observable<ListCreditTimeResponse>;
  abstract create(params:any):Observable<ApiResponse>;
  abstract update(params:any):Observable<ApiResponse>;
}
