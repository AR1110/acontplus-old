import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map, Observable } from 'rxjs';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { ProductRepository } from '@inventory/product/domain/repositories/product.repository';
import { GroupedEstab } from '@core/models/estab.model';
import {
  ProductDataForm,
  ProductSale,
} from '@inventory/product/domain/entities/product.entity';
import { MedidaProducto } from '@inventory/domain/models/measure.model';
import { ProductMapper } from '@inventory/product/infrastructure/product/mappers/product.mapper';
import { ProductDataFormMapper } from '@inventory/product/infrastructure/product/mappers/product-data-form.mapper';
import { ProductGetIdMapper } from '@inventory/product/infrastructure/product/mappers/product-get-id.mapper';
import { ListProductWithPricesUseCaseMapper } from '@inventory/product/infrastructure/product/mappers/list-product-with-prices.mapper';
import { SaveProductMapper } from '@inventory/product/infrastructure/product/mappers/save-product.mapper';
import { GetProductPurchaseMapper } from '@inventory/product/infrastructure/product/mappers/get-product-purchase.mapper';
import { GetProductEstabsStockMapper } from '@inventory/product/infrastructure/product/mappers/get-product-estabs-stock.mapper';
import { ProductSearchMapper } from '@inventory/product/infrastructure/product/mappers/product-search.mapper';
import {GetProductForSaleMapper} from "@inventory/product/infrastructure/product/mappers/get-product-for-sale-mapper";

@Injectable({
  providedIn: 'root',
})
export class ProductHttpRepository implements ProductRepository {
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.PRODUCT_OLD}`;
  private _http = inject(HttpClient);

  getAll<T>(obj: T) {
    const params = {
      json: JSON.stringify({ ...obj, tipo: 1 }),
    };
    return this._http
      .get<ApiResponseLegacy>(`${this._url}`, {
        params,
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          const result = {
            products: [] as any[],
            totalRecords: 0,
          };
          if (response.code === '1') {
            result.products = ProductMapper.fromApiGetAll(response);

            result.totalRecords = result.products.length > 0 ? result.products[0].totalRecords : 0;
          }

          return result;
        }),
      );
  }

  getDataFilter() {
    const params = JSON.stringify({ tipo: 11 });
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${params}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          let data = {
            subCategorias: [],
            medidas: [],
            marcas: [],
            modelos: [],
            tiposIva: [],
          };
          if (response.code === '1') {
            data = ProductMapper.fromApiDataFilter(response);
          }
          return data;
        }),
      );
  }

  getDataForm() {
    const params = {
      json: JSON.stringify({ tipo: 5 }),
    };
    return this._http
      .get<ApiResponseLegacy>(`${this._url}`, {
        params,
      })
      .pipe(
        map((response) => {
          let result = new ProductDataForm();

          if (response.code === '1') {
            result = ProductDataFormMapper.fromJson(response);
          }
          return result;
        }),
      );
  }

  search<T extends { textSearch: string; pageIndex?: number; pageSize?: number; q?: string }>(
    data: T,
  ): Observable<any> {
    const json = ProductSearchMapper.toJson(data);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}Search?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(map((response) => ProductSearchMapper.fromJson(response)));
  }

  getForSale(obj: { id?: number; search?: string }) {
    const params = {
      json: GetProductForSaleMapper.toJson(obj)
    };
    return this._http
      .get<ApiResponseLegacy>(`${this._url}`, {
        params,
      })
      .pipe(
        map((response) => GetProductForSaleMapper.fromJson(response)),
      );
  }

  getForPurchase(id: number) {
    const params = {
      json: GetProductPurchaseMapper.toJson(id),
    };
    return this._http
      .get<ApiResponseLegacy>(`${this._url}`, {
        params,
      })
      .pipe(map((response) => GetProductPurchaseMapper.fromJson(response)));
  }

  checkNotificationStock<
    T extends {
      idArticulo: number;
      cantidad: number;
      idBodega: number;
      idMedida: number;
    },
  >(obj: T) {
    const params = {
      json: JSON.stringify({ ...obj, tipo: 7 }),
    };
    return this._http
      .get<ApiResponseLegacy>(`${this._url}`, {
        params,
      })
      .pipe(map((response) => ProductMapper.fromApiCheckStockNotificacion(response)));
  }

  getDataReport() {
    const params = {
      json: JSON.stringify({ tipo: 13 }),
    };
    return this._http
      .get<ApiResponseLegacy>(`${this._url}`, {
        params,
      })
      .pipe(
        map((response) => {
          const estabs: GroupedEstab[] = [];
          let data = {
            estabs,
            subCategorias: [],
            marcas: [],
            tiposDoc: [],
            tarifas: [],
            taxes: [],
          };
          if (response && response.code === '1') {
            data = ProductMapper.fromApiDataReport(response);
          }
          return data;
        }),
      );
  }

  updateStatus(id: number) {
    return this._http.delete<ApiResponseLegacy>(`${this._url}${id}`);
  }

  getId(id: number) {
    return this._http
      .get<ApiResponseLegacy>(`${this._url}${id}`)
      .pipe(map((response) => ProductGetIdMapper.fromJson(response)));
  }

  post<T>(obj: T, file?: Blob) {
    const data = SaveProductMapper.toJson(obj);
    const paramsJson = JSON.stringify({ data });
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    return this._http
      .post<ApiResponseLegacy>(`${this._url}?json=${paramsJson}`, formData)
      .pipe(map((response) => SaveProductMapper.fromJson(response)));
  }
  put<T>(id: number, obj: T): Observable<ApiResponseLegacy> {
    throw new Error('Method not implemented.');
  }

  listProductWithPrices(params: any): Observable<any> {
    const json = ListProductWithPricesUseCaseMapper.toJson(params);

    return this._http
      .get<ApiResponseLegacy>(`${this._url}`, {
        params: {
          json,
        },
      })
      .pipe(map((response) => ListProductWithPricesUseCaseMapper.fromJson(response)));
  }

  getEstabStock(id: number): Observable<any> {
    const json = JSON.stringify({
      idArticulo: id,
      tipo: 10,
    });
    return this._http
      .get<ApiResponseLegacy>(`${this._url}`, {
        params: {
          json,
        },
        context: getNoLoader(),
      })
      .pipe(map((response) => GetProductEstabsStockMapper.fromJson(response)));
  }
}
