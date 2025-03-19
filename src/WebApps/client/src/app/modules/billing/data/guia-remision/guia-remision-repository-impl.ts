import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map, Observable } from 'rxjs';
import { GuiaRemisionRepository } from '@billing/domain/repositories/guia-remision.repository';
import { GuiaRemisionDataForm } from '@modules/billing/domain/models/guia-remision.model';
import { BILLING_PATHS } from '@billing/domain/enums/billing.enum.ts';
import { GetGuiaRemisionFilterDataMapper } from './get-guia-remision-filter-data.mapper';
import {ListGuiaRemisionMapper} from "@billing/data/guia-remision/list-guia-remision.mapper";
import {GetGuiaRemisionFormDataMapper} from "@billing/data/guia-remision/get-guia-remision-form-data.mapper";

@Injectable({
  providedIn: 'root',
})
export class GuiaRemisionRepositoryImpl implements GuiaRemisionRepository {
    getFormData()  {
      const json = JSON.stringify({
        tipo: 3,
      });
      return this._http
        .get(`${this._url}?json=${json}`)
        .pipe(
          map((response) => GetGuiaRemisionFormDataMapper.fromJson(response))
        );
  }
    getFilterData() {
    const json = JSON.stringify({
      tipo: 2,
    });
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(
        map((response) => GetGuiaRemisionFilterDataMapper.fromJson(response))
      );
  }
    list<T>(parameters: T)  {
      return this._http
        .get(`${this._url}?json=${ListGuiaRemisionMapper.toJson(parameters)}`)
        .pipe(
          map((response) => ListGuiaRemisionMapper.fromJson(response))
        );
   }
  // override getById(id: number): Observable<any> {
  //   throw new Error('Method not implemented.');
  // }
  // override create(data: Partial<any>): Observable<any> {
  //   throw new Error('Method not implemented.');
  // }
  // override update(data: any): Observable<any> {
  //   throw new Error('Method not implemented.');
  // }
  // override delete(id: number): Observable<void> {
  //   throw new Error('Method not implemented.');
  // }

  private _url = `${PATHS_API.FACT_ELECT}${BILLING_PATHS.GUIA_REMISION}`;
  private _http = inject(HttpClient);
}
