import {inject, Injectable} from "@angular/core";
import {UserCustomPermissionRepository} from "@modules/seguridad/domain/repositories/user-custom-permission.repository";
import {map, Observable} from "rxjs";
import {
  ListUserCustomPermissionMapper
} from "@modules/seguridad/data/user-custom-permission/list-user-custom-permission.mapper";
import {SECURITY_API} from "@modules/seguridad/constants/constants";
import {HttpClient} from "@angular/common/http";
import {
  GetUserCustomPermissionFormDataMapper
} from "@modules/seguridad/data/user-custom-permission/get-user-custom-permission-form-data.mapper";
import {ApiResponse} from "acontplus-utils";
import {
  SaveUserCustomPermissionMapper
} from "@modules/seguridad/data/user-custom-permission/save-user-custom-permission.mapper";


@Injectable({
  providedIn: 'root',
})
export class UserCustomPermissionRepositoryImpl implements UserCustomPermissionRepository {
      update(data: any): Observable<ApiResponse> {
        const params = SaveUserCustomPermissionMapper.toJson(data)
        return this._http.patch<ApiResponse>(`${this._url}/${params.id}`, params);
    }
    create(data: Partial<any>): Observable<ApiResponse> {
      const params = SaveUserCustomPermissionMapper.toJson(data)
     return this._http.post<ApiResponse>(`${this._url}`, params);
  }
  getFormData()  {
    const json = JSON.stringify({
      tipo: 3,
    });
    return this._http
      .get<ApiResponse>(`${this._url}/DataForm`)
      .pipe(
        map(response=>GetUserCustomPermissionFormDataMapper.fromJson(response))
      )

  }

  list<T>(parameters: T)  {
    return this._http
      .get<ApiResponse>(`${this._url}?json=${ListUserCustomPermissionMapper.toJson(parameters)}`)
      .pipe(
        map((response) => ListUserCustomPermissionMapper.fromJson(response))
      );
  }

  private _url = `${SECURITY_API.USER_CUSTOM_PERMISSION}`;
  private _http = inject(HttpClient);
}
