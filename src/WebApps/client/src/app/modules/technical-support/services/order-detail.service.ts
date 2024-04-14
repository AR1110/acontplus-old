import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TECH_SUPPORT_PATHS } from '../constants/tech-support.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  private http = inject(HttpClient);
  private url = TECH_SUPPORT_PATHS.ORDER_DETAIL;
  delete(id: number) {
    return this.http
      .delete(`${this.url}${id}`)
      .pipe(map((response) => response));
  }
}
