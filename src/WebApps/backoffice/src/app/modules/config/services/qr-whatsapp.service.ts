import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  StateInstanceGreenApiResponse,
  QrCodeGreenApiResponse,
  SettingGreenApiResponse,
  LogoutGreenApiResponse,
} from '@modules/config/models/qr-whatsapp.model';
import { MAIN_PATHS } from '@core/constants/constants';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { customUrl } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class QrWhatsappService {
  #idInstance = '7103845341';
  #apiTokenInstance = 'a59cd09ed1f449d8981586c7cf24526dfa9c8e6eedf1489b8c';
  #http = inject(HttpClient);

  #url = `${MAIN_PATHS.GREEN_API}${CONFIG_PATHS.WA_INSTANCE}`;

  getStateInstance() {
    return this.#http.get<StateInstanceGreenApiResponse>(
      `${this.#url}${this.#idInstance}/getStateInstance/${this.#apiTokenInstance}`,
      {
        context: customUrl(),
      },
    );
  }

  getQrCode() {
    return this.#http.get<QrCodeGreenApiResponse>(
      `${this.#url}${this.#idInstance}/qr/${this.#apiTokenInstance}`,
      {
        context: customUrl(),
      },
    );
  }

  getSetting() {
    return this.#http.get<SettingGreenApiResponse>(
      `${this.#url}${this.#idInstance}/getSettings/${this.#apiTokenInstance}`,
      {
        context: customUrl(),
      },
    );
  }

  logout() {
    return this.#http.get<LogoutGreenApiResponse>(
      `${this.#url}${this.#idInstance}/logout/${this.#apiTokenInstance}`,
      {
        context: customUrl(),
      },
    );
  }
}
