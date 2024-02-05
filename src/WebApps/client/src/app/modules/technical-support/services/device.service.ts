import { Injectable, inject } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { TECH_SUPPORT_PATHS } from '../constants/tech-support.constants';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Device, DeviceSearch } from '../models/device.model';
import { isApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  url = `${PATHS_API.TECHSUPPORT}${TECH_SUPPORT_PATHS.DEVICE}`;
  private http = inject(HttpClient);

  delete(id: number) {
    return this.http.delete(`${this.url}${id}`).pipe(
      map((response) => {
        response;
      })
    );
  }

  get(params: any) {
    return this.http
      .get(`${this.url}?json=${params}`)
      .pipe(map((response) => response));
  }

  post(data: Device) {
    return this.http.post(this.url, data).pipe(map((response) => response));
  }

  put(id: number, data: Device) {
    return this.http
      .put(`${this.url}${id}`, data)
      .pipe(map((response) => response));
  }

  search<T extends { textSearch: string }>(
    data: T
  ): Observable<Array<DeviceSearch>> {
    let query = {
      tipo: 3,
      textSearch: data.textSearch,
    };
    return this.http.get(`${this.url}?json=${JSON.stringify(query)}`).pipe(
      map((response) => {
        if (isApiResponse(response)) {
          let { devices } =
            (response.payload && JSON.parse(response.payload as string)) || [];
          return devices || [];
        }
        return [];
      })
    );
  }
}
