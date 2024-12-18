import { ApiResponse } from "@/domain/models/api-response";
import { Observable } from "rxjs";

export abstract class AuthRepository {
  abstract login(obj: { username: string, password: string }): Observable<ApiResponse>;
  abstract createToken<T>(obj: T): Observable<ApiResponse>;
}
