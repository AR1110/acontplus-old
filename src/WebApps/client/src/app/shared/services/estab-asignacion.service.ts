import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PATHS, PATHS_API } from '@core/constants/global.constants';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstabAsignacionService {
  private url = `${PATHS_API.CONFIG}${PATHS.ESTAB_ASIGN}`;
  private http = inject(HttpClient);

  getAll() {
    const params = JSON.stringify({
      tipo: 1,
    });
    return this.http.get(`${this.url}?json=${params}`).pipe(
      map((response) => {
        let estabs: EstablecimientoSelectHtmlOnly[] = [];
        if (Array.isArray(response)) {
          estabs = response.map((item) => {
            return {
              idEstablecimiento: item.idEstablecimiento,
              codEstab: item.codEstab,
              nombreComercial: item.nombreComercial,
              predeterminado: item.predeterminado,
              estab: item.estab,
            };
          });
        }
        return estabs;
      }),
    );
  }
}
