import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ACCOUNTING_PATHS } from '@modules/accounting/enums/accounting.constants';
import { PATHS_API } from '@core/constants/global.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.SUBCATEGORY}`;

  get<T>(params: T) {
    return this.http
      .get(`${this.url}?json=${JSON.stringify(params)}`)
      .pipe(map((response) => response));
  }

  delete(id: number) {
    return this.http
      .delete(`${this.url}${id}`)
      .pipe(map((response) => response));
  }

  post(data: any) {
    return this.http
      .post(`${this.url}`, data)
      .pipe(map((response) => response));
  }

  put(id: number, data: any) {
    return this.http
      .put(`${this.url}${id}`, data)
      .pipe(map((response) => response));
  }
}
