import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PATHS, PATHS_API } from '@domain/enums/main.enum';
import { sanitizeAndEncodeURIComponent } from '@domain/utils/utils';
import { map } from 'rxjs/operators';
import {
  ProductoConsolidacion,
  ProductSale,
  ProductSearchDto,
} from '@domain/models/inventory/product.model';
import { ApiResponse } from '@domain/models/api-response';
import { MedidaProducto } from '@domain/models/inventory/medida.model';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { ProductAdapter } from './product.adapter';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = `${PATHS_API.INVENTORY}${PATHS.PRODUCT}`;
  private http = inject(HttpClient);

  search<T extends { textSearch: string }>(obj: T) {
    const json = JSON.stringify({
      pageIndex: 1,
      pageSize: 30,
      busqueda: sanitizeAndEncodeURIComponent(obj.textSearch),
    });

    return this.http
      .get<ApiResponse>(`${this.url}Search?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          let results: ProductSearchDto[] = [];
          if (response.code == '1') {
            const productsFound = JSON.parse(response.payload as string) ?? [];
            results = ProductAdapter.fromApiSearch(productsFound);
          }
          return results;
        })
      );
  }

  getForSale(productId: number, bodegaId?: number) {
    const json = JSON.stringify({
      idArticulo: productId,
      idBodega: bodegaId,
      tipo: 6,
    });

    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map((response) => {
        let results = {
          product: {} as ProductSale,
          medidas: [] as MedidaProducto[],
          productoConsolidaciones: [] as ProductoConsolidacion[],
        };
        if (response.code === '1') {
          const repositoryData = JSON.parse(response.payload as string);

          results = ProductAdapter.fromApiGetSale(repositoryData);
        }
        return results;
      })
    );
  }

  checkNotificationStock(obj: {
    idArticulo: number;
    cantidad: number;
    idBodega: number;
  }) {
    let json = JSON.stringify({
      tipo: 7,
      ...obj,
    });

    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map((response) => {
        if (response.code === '0') {
          throw response;
        }
        return ProductAdapter.fromApiCheckStockNotificacion(response);
      })
    );
  }
}
