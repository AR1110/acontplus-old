import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TECH_SUPPORT_PATHS } from '../constants/tech-support.constants';
import { map } from 'rxjs';
import { PATHS_API } from '@core/constants/global.constants';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.TECHSUPPORT}${TECH_SUPPORT_PATHS.ORDER_DETAIL}`;
  delete(id: number) {
    return this.http
      .delete(`${this.url}${id}`)
      .pipe(map((response) => response));
  }
  put(id: number, data: any) {
    return this.http
      .put(`${this.url}${id}`, { data })
      .pipe(map((response) => response));
  }
}
