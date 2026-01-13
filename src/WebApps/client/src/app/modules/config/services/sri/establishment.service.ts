import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { EstablishmentRead } from '@modules/config/data/models/establishment.model';
import { map } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class EstablishmentService {
  #url = `${PATHS_API.CONFIG}${CONFIG_PATHS.ESTABLISHMENT}`;
  #http = inject(HttpClient);

  constructor() {}

  getDataForm() {
    const json = JSON.stringify({
      tipo: 2,
    });
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        const { cantones, actividadesEconomica, agentesRetencion, contribuyentes, ambientes } =
          response;
        const result = {
          cantones,
          actividadesEconomica,
          agentesRetencion,
          contribuyentes,
          ambientes,
        };

        return result;
      }),
    );
  }

  getAll<T>(obj: T) {
    const json = JSON.stringify({
      ...obj,
      tipo: 1,
    });
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        let establishments: EstablishmentRead[] = [];
        if (response !== null && typeof response === 'object') {
          establishments = response.estabs;
        }
        return establishments;
      }),
    );
  }

  getId(id: number) {
    const json = JSON.stringify({
      id,
      tipo: 3,
    });
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        const { correo, telefono, ...mainData } = response.data[0];

        const correos = correo ? correo.split(/[\|;]/) : [];
        const telefonos = telefono ? telefono.split(/[\|;]/) : [];

        const data = {
          idEstablecimiento: mainData.idEstablecimiento,
          codEstab: mainData.codEstab,
          canton: mainData.canton,
          actividad: mainData.actividad,
          agenteRetencion: mainData.agenteRetencion,
          contribuyente: mainData.contribuyente,
          ruc: mainData.ruc,
          estab: mainData.estab,
          contribuyenteEspecial: mainData.contribuyenteEspecial,
          obligadoContabilidad: mainData.obligadoContabilidad,
          nombreComercial: mainData.nombreComercial,
          dirEstablecimiento: mainData.dirEstablecimiento,
          // telefono: mainData.telefono,
          contribuyenteRimpe: mainData.contribuyenteRimpe,
          // correo: mainData.correo,
          estado: mainData.estado,
          autoSriAuth: mainData.autoSriAuth,
          emails: correos,
          telephones: telefonos,
        };
        return {
          data,
          puntosEmision: response.puntosEmision,
        };
      }),
    );
  }

  post<T>(data: T) {
    return this.#http.post<ApiResponseLegacy>(`${this.#url}`, { data });
  }
  put<T>(id: number, data: T) {
    return this.#http.put<ApiResponseLegacy>(`${this.#url}${id}`, { data });
  }

  closeEstab(id: number) {
    return this.#http.delete<ApiResponseLegacy>(`${this.#url}${id}`);
  }

  putSriAuth(id: number, autoSriAuth: boolean) {
    return this.#http.put<ApiResponseLegacy>(`${this.#url}PutSriAuth/${id}/${autoSriAuth}`, null);
  }
}
