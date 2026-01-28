import {inject, Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import {SECURITY_API} from "@modules/seguridad/constants/constants";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "acontplus-utils";
import {ActionRepository} from "@modules/seguridad/domain/repositories/action.repository";
import {ListActionMapper} from "@modules/seguridad/data/action/list-action.mapper";
import {ActionList} from "@modules/seguridad/domain/models/action.model";


@Injectable({
  providedIn: 'root',
})
export class ActionRepositoryImpl implements ActionRepository {
      updateStatus(id: number): Observable<ApiResponse> {
        return this._http
          .delete<ApiResponse>(`${this._url}${id}`)
          .pipe(map((response) => response));
    }
      update(data: Partial<ActionList>): Observable<ApiResponse> {
        return this._http.put<ApiResponse>(`${this._url}${data.id}`, data);
    }
    create(data: Partial<ActionList>): Observable<ApiResponse> {
     return this._http.post<ApiResponse>(`${this._url}`, data);
  }

  list<T>(parameters: T)  {
    return this._http
      .get<ApiResponse>(`${this._url}?json=${ListActionMapper.toJson(parameters)}`)
      .pipe(
        map((response) => ListActionMapper.fromJson(response))
      );
  }

  private _url = `${SECURITY_API.ACTIONS}`;
  private _http = inject(HttpClient);
}
