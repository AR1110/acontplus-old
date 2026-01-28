import { inject, Injectable } from '@angular/core';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from 'acontplus-utils';
import { WhatsappUsage } from '@modules/config/models/whatsapp-usage.model';
import { formatDate } from '@core/utils/date.util';

@Injectable({
  providedIn: 'root',
})
export class WhatsappUsageService {
  private readonly _url = CONFIG_PATHS.WHATSAPP_USAGE;
  private readonly _http = inject(HttpClient);

  getDataByCompanyId(companyId: number) {
    return this._http
      .get<ApiResponse>(`${this._url}?companyId=${companyId}`)
      .pipe(
        map((response) => {
          let data = {} as WhatsappUsage;

          if (response.code === '1') {
            const { usages } = JSON.parse(response.payload as string);
            data = usages[0].usage;
            data.startDate = formatDate(data.startDate);
            data.endDate = data.endDate && formatDate(data.endDate);
          }
          return data;
        }),
      );
  }

  post<T>(data: T) {
    return this._http
      .post<ApiResponse>(`${this._url}`, data)
      .pipe(map((response) => response));
  }

  put<T>(id: number, data: T) {
    return this._http
      .put<ApiResponse>(`${this._url}${id}`, data)
      .pipe(map((response) => response));
  }
}
