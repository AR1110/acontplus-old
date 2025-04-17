import {inject, Injectable} from "@angular/core";
import {PATHS_API} from "@core/constants/global.constants";
import {ACCOUNTING_PATHS} from "@accounting/core/enums/accounting.constants";
import {HttpClient} from "@angular/common/http";
import {ApiResponse } from "@core/models/api-response";
import {map} from "rxjs";
import {ResumenContableRepository} from "@accounting/core/repositories/resumen-contable.repository";
import {SubCategorySelectHtmlOnly} from "@accounting/core/models/subcategory";
import {CategoryRepository} from "@accounting/core/repositories/category.repository";


@Injectable({
  providedIn: 'root'
})
export class CategoryWebRepository extends CategoryRepository{

  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CATEGORY}`;
  private _http = inject(HttpClient);


  constructor() {
    super();
  }

  get<T>(params: T) {
    return this._http
      .get(`${this._url}?json=${JSON.stringify(params)}`)
  }

  delete(id: number) {
    return this._http
      .delete<ApiResponse>(`${this._url}${id}`)
  }

  post<T>(data: T) {
    return this._http
      .post<ApiResponse>(`${this._url}`, data)
  }

  put<T>(id: number, data: T) {
    return this._http
      .put<ApiResponse>(`${this._url}${id}`, data)
  }

}
