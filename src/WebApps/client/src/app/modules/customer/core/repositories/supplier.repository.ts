import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";

export abstract class SupplierRepository {
  abstract search<T  extends {textSearch: string}>(obj:T): Observable<any[]>;

}
