import {inject, Injectable} from "@angular/core";
import {PATHS_API} from "@core/constants/global.constants";
import {ACCOUNTING_PATHS} from "@accounting/core/enums/accounting.constants";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "@core/models/api-response";
import {map} from "rxjs";
import {SubCategoryMapper} from "@accounting/data/sub-category/sub-category.mapper";
import {SubCategoryRepository} from "@accounting/core/repositories/sub-category.repository";


@Injectable({
  providedIn: 'root'
})
export class SubCategoryWebRepository extends SubCategoryRepository{

  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.SUBCATEGORY}`;
  private _http = inject(HttpClient);

  constructor() {
    super();
  }

  getAll<T>(obj: T) {
    let json = JSON.stringify({
      tipo: 1,
      ...obj
    })

    return this._http
      .get<ApiResponse>(`${this._url}?json=${json}`)
      .pipe(
        map((response) => {
          let data = [] as any[]

          if(response.code==="1"){
            data = SubCategoryMapper.fromApiGetAll(JSON.parse(response.payload as string))
          }
          // if (response.code !== '1') {
          //   return handleResponse(parameters.tipo, {});
          // }
          // try {
          //   const parsedPayload = JSON.parse(response.payload as string);
          //   return handleResponse(parameters.tipo, parsedPayload);
          // } catch (error) {
          //   console.warn('Failed to parse response payload:', error);
          //   return handleResponse(parameters.tipo, {});
          // }
          return data;
        }),
      );
  }

  getDataForm(){
    let json = JSON.stringify({
      tipo: 2
    })
    return this._http
      .get<ApiResponse>(`${this._url}?json=${json}`)
      .pipe(
        map((response) => {
           let result = {
             categories: []
           }
           if(response.code==="1"){
             let mainData = JSON.parse(response.payload as string);
             result.categories = mainData.categories;
           }
          return result;
        }),
      );
  }

  delete(id: number) {
    return this._http
      .delete<ApiResponse>(`${this._url}${id}`)
  }

  create(data: any) {
    return this._http
      .post<ApiResponse>(`${this._url}`, data)
  }

  update<T>(id: number, data: T) {
    return this._http
      .put<ApiResponse>(`${this._url}${id}`, data)
  }

}
