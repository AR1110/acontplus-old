import { hideLoader, showLoader } from '@core/utils/loader';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { BILLING_PATHS } from '../enums/billing.enum.ts';
import { SharedService } from '@core/services/shared.service.js';
import { ToasterService } from '@core/services/toaster.service';

@Injectable({
  providedIn: 'root',
})
export class AtsService {
  sharedSvc = inject(SharedService);
  tS = inject(ToasterService);
  #url = `${PATHS_API.BILLING}${BILLING_PATHS.ATS}`;
  #http = inject(HttpClient);

  constructor() {}

  download<T>(obj: T) {
    let json = JSON.stringify(obj);
    showLoader();
    this.#http
      .get(`${this.#url}Download?json=${json}`, {
        responseType: 'blob',
        observe: 'response',
      })
      .subscribe({
        next: (response: any) => {
          hideLoader();
          if (response.id == 0 || response.code === '0') {
            this.tS.toastr({
              type: 'warning',
              message: response.message,
            });
            return;
          }
          // if (response.data.size > 0) {
          this.sharedSvc.saveFile(response);

          //}
        },
      });
  }
}
