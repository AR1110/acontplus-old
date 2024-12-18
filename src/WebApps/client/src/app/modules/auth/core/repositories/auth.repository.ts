
import { Observable } from "rxjs";
import {ApiResponse} from "@core/models/api-response";

export abstract class AuthRepository {
  abstract login(obj:{username: string, password: string}): Observable<ApiResponse>;
}
