import { Observable } from "rxjs";
import { ApiResponse } from "@core/models/api-response";
import { User } from "../models/user.model";

export abstract class AuthRepository {
  abstract login(obj: { username: string, password: string, userAgent: string }): Observable<any>;
  abstract register(user: User): Observable<ApiResponse>;
}
