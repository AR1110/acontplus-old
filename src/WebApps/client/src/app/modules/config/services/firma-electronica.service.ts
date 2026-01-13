import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/config-const';

@Injectable({
  providedIn: 'root',
})
export class FirmaElectronicaService {
  #url = `${PATHS_API.CONFIG}${CONFIG_PATHS.FIRMA_ELECTRONICA}`;
  #http = inject(HttpClient);
  post<T>(data: T, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.#http.post(`${this.#url}?json=${JSON.stringify(data)}`, formData);
  }
}
