import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { BILLING_PATHS } from '../enums/billing.enum.ts';
import { SharedService } from '@core/services/shared.service.js';
import { ApiResponse } from '@core/models/api-response';
import { map } from 'rxjs';
import { ToasterService } from '@core/services/toaster.service';

@Injectable({
  providedIn: 'root',
})
export class AtsService {
  #url = `${PATHS_API.BILLING}${BILLING_PATHS.ATS}`;
  #http = inject(HttpClient);
  private readonly _sharedSvc = inject(SharedService);
  private readonly _tS = inject(ToasterService);

  constructor() {}

  checkValidation<T>(params: T) {
    return this.#http
      .get<ApiResponse>(
        `${this.#url}CheckValidation/?json=${JSON.stringify(params)}`,
      )
      .pipe(map((response) => response));
  }

  download<T>(obj: T) {
    let json = JSON.stringify(obj);
    this.#http
      .get(`${this.#url}Download?json=${json}`, {
        responseType: 'blob',
        observe: 'response',
      })
      .subscribe({
        next: (response: any) => {
          this._sharedSvc.saveFile(response);
        },
        error: (error: any) => {
          return this._tS.toastr({
            type: 'warning',
            message: `Error en el servidor`,
          });
        },
        complete: () => {
          // Optional completion handler
        },
      });
  }
}
