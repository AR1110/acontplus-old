import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '@inventory/inventory.const';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import { MassiveTaxRepository } from '@inventory/data/repositories/massive-tax.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable()
export class MassiveTaxHttp implements MassiveTaxRepository {
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.MASSIVE_TAX}`;
  private http = inject(HttpClient);

  getDataForm(): Observable<{ taxRates: TarifaImpuesto[]; subCategories: any[] }> {
    const json = JSON.stringify({ tipo: 3 });
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        let taxRates: TarifaImpuesto[] = [];
        let subCategories: any[] = [];
        if (response !== null && typeof response === 'object') {
          taxRates = response.taxes.map((item: any) => ({
            idTarifaImpuesto: item.idTipoIva,
            descripcion: item.descripcion,
            porcentaje: item.codigoPorcentaje,
          }));
          subCategories = response.subCategories || [];
        }
        return {
          taxRates,
          subCategories,
        };
      }),
    );
  }

  getAll<T>(obj: T): Observable<any[]> {
    const json = JSON.stringify({ ...obj, tipo: 1 });
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        let histories = [];
        if (response !== null && typeof response === 'object') {
          histories = response.history;
        }
        return histories;
      }),
    );
  }

  getQuantityProductByTaxId<T>(obj: T): Observable<number> {
    const json = JSON.stringify({ ...obj, tipo: 2 });
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

  put<T>(data: T): Observable<ApiResponseLegacy> {
    return this.http.put<ApiResponseLegacy>(`${this.url}`, { data });
  }
}
