import {inject, Injectable} from "@angular/core";
import {map } from "rxjs";
import {SECURITY_API} from "@modules/seguridad/constants/constants";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "acontplus-utils";
import {BugsRepository} from "@modules/common/domain/repositories/bugs.repository";
import {ListBugsMapper} from "@modules/common/data/bugs/list-bugs.mapper";


@Injectable({
  providedIn: 'root',
})
export class BugsRepositoryImpl implements BugsRepository {

  list<T>(parameters: T)  {
    return this._http
      .get<ApiResponse>(`${this._url}?json=${ListBugsMapper.toJson(parameters)}`)
      .pipe(
        map((response) => ListBugsMapper.fromJson(response))
      );
  }

  private _url = `${SECURITY_API.BUGS}`;
  private _http = inject(HttpClient);
}
