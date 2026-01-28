import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class EstablishmentLogoService {
  #url = `${PATHS_API.CONFIG}${CONFIG_PATHS.ESTABLISHMENT_LOGO}`;
  #http = inject(HttpClient);

  getDataLogo(establecimientoId: number) {
    return this.#http.get(`${this.#url}${establecimientoId}`);
  }

  post<T>(establecimientoId: number, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.#http.post<ApiResponseLegacy>(`${this.#url}${establecimientoId}`, formData);
  }

  put(logoId: number, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.#http.post<ApiResponseLegacy>(`${this.#url}Put/${logoId}`, formData);
  }

  removeImage(establecimientoId: number) {
    return this.#http.delete<ApiResponseLegacy>(`${this.#url}${establecimientoId}`);
  }
}
