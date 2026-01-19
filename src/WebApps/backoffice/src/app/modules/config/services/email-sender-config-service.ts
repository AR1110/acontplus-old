import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { map } from 'rxjs';
import { ApiResponse } from 'acontplus-utils';
import { EmailSenderConfig } from '@modules/config/models/email-sender-config.model';

@Injectable({
  providedIn: 'root',
})
export class EmailSenderConfigService {
  private readonly _http = inject(HttpClient);
  private readonly _url = CONFIG_PATHS.EMAIL_SENDER_CONFIG;

  getData() {
    let json = JSON.stringify({
      tipo: 1,
    });
    return this._http.get<ApiResponse>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        if (response.code != '1') {
          return { emailSenderConfigs: [] };
        }
        let { emailSenderConfigs } = JSON.parse(response.payload as string);
        return { emailSenderConfigs: emailSenderConfigs || [] };
      }),
    );
  }

  post<T>(data: T) {
    return this._http.post<ApiResponse>(`${this._url}`, data);
  }
  put<T>(id: number, data: T) {
    return this._http.put<ApiResponse>(`${this._url}${id}`, data);
  }
}
