import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { map } from 'rxjs';
import { PATHS_API } from '@core/constants/global.constants';

@Injectable({
  providedIn: 'root',
})
export class TiempoCreditoService {
  #http = inject(HttpClient);
  #url = `${PATHS_API.CONFIG}${CONFIG_PATHS.TIEMPO_CREDITO}`;

  get<T>(params: T) {
    this.#http.get(`${this.#url}?json=${JSON.stringify(params)}`).pipe(map((response) => response));
  }
}
