import { Injectable, inject } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { TECH_SUPPORT_PATHS } from '../constants/tech-support.constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceCustomerService {
  url = `${PATHS_API.TECHSUPPORT}${TECH_SUPPORT_PATHS.DEVICE_CUSTOMER}`;
  private http = inject(HttpClient);

  get(params: any) {
    return this.http
      .get(`${this.url}?json=${params}`)
      .pipe(map((response) => response));
  }
}
