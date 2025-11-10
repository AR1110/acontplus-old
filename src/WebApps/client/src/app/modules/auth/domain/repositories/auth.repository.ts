import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { User } from '../models/user.model';

export abstract class AuthRepository {
  abstract login(obj: { username: string; password: string; userAgent: string }): Observable<{
    success: boolean;
    message: string;
    userRoles: any[];
    userRolesOriginal: any[];
  }>;
  abstract register(user: User): Observable<ApiResponseLegacy>;
  abstract requestAccess(user: any): Observable<ApiResponseLegacy>;
  abstract authenticate(user: any): Observable<ApiResponseLegacy>;
  abstract createToken(user: any): Observable<any>;
}
