import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';

@Injectable({
  providedIn: 'root',
})
export class MassiveTaxService {
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.MASSIVE_TAX}`;
  private http = inject(HttpClient);

  getDataForm() {
    const json = JSON.stringify({ tipo: 3 });
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        let taxRates: TarifaImpuesto[] = [];
        if (response !== null && typeof response === 'object') {
          taxRates = response.taxes.map((item: any) => ({
            idTarifaImpuesto: item.idTipoIva,
            descripcion: item.descripcion,
            porcentaje: item.codigoPorcentaje,
          }));
        }
        return {
          taxRates,
        };
      }),
    );
  }

  getAll<T>(obj: T) {
    const json = JSON.stringify({ ...obj, tipo: 1 });
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        let histories = [];
        if (response !== null && typeof response === 'object') {
          histories = response.history;
        }
        console.log(histories);
        return histories;
      }),
    );
  }

  getQuantityProductByTaxId(taxId: number) {
    const json = JSON.stringify({ taxId, tipo: 2 });
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        let quantity = 0;
        if (response !== null && typeof response === 'object') {
          quantity = Array.isArray(response.quantity) ? response.quantity[0]?.quantity : 0;
        }
        return quantity;
      }),
    );
  }

  put<T>(data: T) {
    return this.http.put(`${this.url}`, { data });
  }
}
