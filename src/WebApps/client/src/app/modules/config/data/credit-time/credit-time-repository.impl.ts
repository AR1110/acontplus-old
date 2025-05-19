import {inject, Injectable} from "@angular/core";
import {CreditTimeRepository} from "@modules/config/domain/repositories/credit-time.repository";
import {PATHS_API} from "@core/constants/global.constants";
import {CONFIG_PATHS} from "@modules/config/domain/enums/config.enums";
import {HttpClient} from "@angular/common/http";
import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CreditTimeRepositoryImpl implements CreditTimeRepository {
   list(params: any): Observable<any> {
      return this._http.get<ApiResponse>(`${this._url}?json=`)
  }
   create(params: any): Observable<ApiResponse> {
      throw new Error("Method not implemented.");
  }
   update(params: any): Observable<ApiResponse> {
      throw new Error("Method not implemented.");
  }

  private _url =`${PATHS_API.CONFIG}${CONFIG_PATHS.TIEMPO_CREDITO}`;
  private _http = inject(HttpClient)
}
