import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";

export abstract class CustomerRepository {
  abstract getAll<T>(obj:T): Observable<any[]>;

}
