import { inject, Injectable } from '@angular/core';
import {
  PATHS_API,
  SEPARATOR_KEY_CODE,
} from '@core/constants/global.constants';
import { CONFIG_PATHS } from '../enums/config.enums';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class GeneralConfigService {
  #url = `${PATHS_API.CONFIG}${CONFIG_PATHS.GENERAL_CONFIG}`;
  #http = inject(HttpClient);

  getData(code: string) {
    let json = JSON.stringify({ codConfig: code });
    return this.#http.get<ApiResponse>(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        let mainDataForm = {
          configVenta: {} as any,
          decimalAlmacen: {} as any,
          decimalVenta: {} as any,
          decimalCompra: {} as any,
          formasPagoSri: [] as any,
          configInventario: {} as any,
          metodosValoracion: [],
          notificaciones: [],
        };
        if (response.code !== '1') {
          return mainDataForm;
        }
        const { data, formasPagoSri, metodosValoracion, notificaciones } =
          JSON.parse(response.payload as string);

        switch (code) {
          case 'CV':
            let {
              nombreFiscal,
              numeroIdentificacion,
              descripcion,
              cc,
              ...restData
            } = data[0];
            mainDataForm.configVenta = {
              ...restData,
              razonSocialComprador: nombreFiscal,
              numeroIdentificacionComprador: numeroIdentificacion,
              nombreArticulo: descripcion,
              cc: cc ? cc.split(SEPARATOR_KEY_CODE.SLASH) : [],
            };
            mainDataForm.formasPagoSri = formasPagoSri;
            break;

          case 'CI':
            mainDataForm.configInventario = data[0];
            mainDataForm.metodosValoracion = metodosValoracion;
            break;

          case 'CD':
            mainDataForm.decimalAlmacen = data.find(
              (item: any) => item.codTransaccion === 'AL',
            );
            mainDataForm.decimalVenta = data.find(
              (item: any) => item.codTransaccion === 'V',
            );
            mainDataForm.decimalCompra = data.find(
              (item: any) => item.codTransaccion === 'C',
            );
            break;

          case 'CS':
            mainDataForm.notificaciones = notificaciones;
            break;
        }
        return mainDataForm;
      }),
    );
  }

  put<T>(data: T) {
    return this.#http.put(this.#url, { data });
  }
}
