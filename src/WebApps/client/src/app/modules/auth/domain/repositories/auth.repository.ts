import { Observable } from "rxjs";
import { ApiResponse } from "@core/models/api-response";
import { User } from "../models/user.model";
import { UserData } from "../models/user-data.model";

export abstract class AuthRepository {
  abstract login(obj: { username: string, password: string }): Observable<ApiResponse>;
  abstract register(user: User): Observable<ApiResponse>;
}
