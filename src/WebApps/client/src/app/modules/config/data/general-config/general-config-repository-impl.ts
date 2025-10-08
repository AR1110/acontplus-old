import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import { CONFIG_PATHS } from '@modules/config/domain/enums/config.enums';
import { ApiResponse } from '@core/models/api-response';
import { GeneralConfigRepository } from '@modules/config/domain/repositories/general-config.repository';
import { ListGeneralConfigMapper } from '@modules/config/data/general-config/list-general-config.mapper';
import { APP_POLICIES } from '@core/constants/policies.constants';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GeneralConfigRepositoryImpl implements GeneralConfigRepository {
  update<T>(parameters: T): Observable<ApiResponse> {
    return this._http.put<ApiResponse>(this._url, { data: parameters });
  }

  list(parameters: string) {
    return this._http
      .get<ApiResponse>(`${this._url}?json=${ListGeneralConfigMapper.toJson(parameters)}`)
      .pipe(map(response => ListGeneralConfigMapper.fromJson(response, parameters)));
  }

  sendPolicy(codePolicy: string): Observable<ApiResponse> {
    const payload = {
      codeApp: APP_POLICIES.CODE_APP,
      codePolicy,
      tipo: APP_POLICIES.TYPES.ADVANCED,
    };

    const params = new HttpParams().set('json', JSON.stringify(payload));

    return this._http.get<ApiResponse>(this._url, { params }).pipe(
      map(response => {
        if (response.code === '1') {
          const parsedPayload = JSON.parse(response.payload as string);

          const table: ApiResponse[] = Array.isArray(parsedPayload.data) ? parsedPayload.data : [];

          for (const row of table) {
            if (row.code === '0') {
              Swal.fire({ icon: 'warning', html: row.message });
              throw new Error(row.message);
            }
          }

          return table[0];
        } else {
          Swal.fire({ icon: 'warning', html: response.message || 'An error occurred.' });
          throw new Error(response.message || 'General error');
        }
      }),
      catchError(error => {
        console.error('Error in sendPolicy:', error);
        return throwError(() => error);
      }),
    );
  }

  sendMaxUsers(): Observable<ApiResponse | null> {
    return this.sendPolicy(APP_POLICIES.POLICIES.MAX_USERS);
  }

  sendMaxDocuments(): Observable<ApiResponse | null> {
    return this.sendPolicy(APP_POLICIES.POLICIES.MAX_DOCUMENTS);
  }

  sendMaxInventoryItems(): Observable<ApiResponse | null> {
    return this.sendPolicy(APP_POLICIES.POLICIES.MAX_INVENTORY_ITEMS);
  }

  sendMaxWarehouses(): Observable<ApiResponse | null> {
    return this.sendPolicy(APP_POLICIES.POLICIES.MAX_WAREHOUSES);
  }

  sendMaxEstablishments(): Observable<ApiResponse | null> {
    return this.sendPolicy(APP_POLICIES.POLICIES.MAX_ESTABLISHMENTS);
  }

  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.GENERAL_CONFIG}`;
  private _http = inject(HttpClient);
}
