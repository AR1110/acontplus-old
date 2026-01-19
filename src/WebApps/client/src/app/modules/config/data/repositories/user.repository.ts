import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  User,
  UserDataForm,
  UserListResponse,
} from '@modules/config/data/models/user/user.model';
import { Observable } from 'rxjs';

export abstract class UserRepository {
  abstract list<T>(parameters: T): Observable<UserListResponse>;
  abstract create<T>(parameters: T): Observable<ApiResponseLegacy>;
  abstract update(parameters: User): Observable<ApiResponseLegacy>;
  abstract dataForm(): Observable<UserDataForm>;
}
