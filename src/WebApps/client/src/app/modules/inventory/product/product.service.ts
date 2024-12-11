import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {PATHS_API} from '@core/constants/global.constants';
import {getNoLoader} from '@core/interceptors/loader.interceptor';
import {ApiResponse} from '@core/models/api-response';
import {GroupedEstab} from '@core/models/estab.model';
import {map, Observable} from 'rxjs';

import {ProductAdapter} from './product.adapter';
import {INVENTORY_PATHS} from '../enums/inventory.enum';
import {MedidaProducto} from '../models/measure.model';
import {ProductSale, ProductSearch} from './product.model';
import {GroupedSubFamilia} from '../models/sub-category.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private url_old = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.PRODUCT_OLD}`;
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.PRODUCT_OLD}`;


  getDataFilter() {
    let params = JSON.stringify({ tipo: 11 })
    return this.http.get<ApiResponse>(`${this.url}Get?json=${params}`, {
      context: getNoLoader()
    }).pipe(
      map(response => {
        let data = {
          subCategorias: [],
          medidas: [],
          marcas: [],
          modelos: [],
          tiposIva: []
        };
        if (response.code === "1") {
          data = ProductAdapter.fromApiDataFilter(response)
        }
        return data;
      })
    )
  }

  getDataForm() {
    let params = {
      json: JSON.stringify({ tipo: 5 })
    }
    return this.http.get<ApiResponse>(`${this.url}Get`, {
      params
    }).pipe(
      map((response) => {
        let result = {
          categorias: [],
          decimal: {},
          estabs: [] as GroupedEstab[],
          etiquetas: [],
          marcas: [],
          medidas: [],
          modelos: [],
          subCategorias: [],
          subCategoriasGroup: [] as GroupedSubFamilia[],
          tarifas: [],
          tiposArticulo: [],
          tiposIce: [],
          tiposIva: [],
        }

        if (response.code === "1") {
         result = ProductAdapter.fromApiDataForm(response)
        }
        return result;
      })
    )
  }

  getAll<T extends { pageIndex: number, pageSize: number }>(obj: T) {
    let params = {
      json: JSON.stringify({ ...obj, tipo: 1 })
    }
    return this.http.get<ApiResponse>(`${this.url}Get`, {
      params,
      context: getNoLoader()
    }).pipe(map((response) => {
      let result = {
        products: [] as any[],
        totalRecords: 0,
      }
      if (response.code === "1") {
         result.products = ProductAdapter.fromApiGetAll(response);

         result.totalRecords = result.products.length>0? result.products[0].totalRecords : 0;
      }

      return result;

    }))
  }

  // get(params: any) {
  //   return this.http
  //     .get(`${this.url_old}Get?json=${params}`)
  //     .pipe(map((response) => response));
  // }

  search<T extends { textSearch: string, pageIndex?: number, pageSize?: number }>(
    data: T
  ): Observable<Array<ProductSearch>> {
    let query = {
      pageIndex: data.pageIndex ?? 1,
      pageSize: data.pageSize ?? 15,
      busqueda: data.textSearch,
    };
    return this.http
      .get<ApiResponse>(`${this.url_old}Search?json=${JSON.stringify(query)}`, {
        context: getNoLoader()
      })
      .pipe(
        map((response) => {
          if (response.code==="1") {
            let results = response.payload && JSON.parse(response.payload as string) || [];
            return ProductAdapter.searchFrom(results);
          }
          return [];
        })
      );
  }


  getDataReport() {
    let params = {
      json: JSON.stringify({ tipo: 13 })
    }
    return this.http.get<ApiResponse>(`${this.url_old}Get`, {
      params
    }).pipe(
      map(response => {
        let estabs: GroupedEstab[] = [];
        let data = {
          estabs,
          subCategorias: [],
          marcas: [],
          tiposDoc: [],
          tarifas: []
        }
        if (response && response.code==="1") {
          data = ProductAdapter.fromApiDataReport(response)
        }
        return data;
      })
    )
  }


  getForSale(id: number) {
    let params = {
      json: JSON.stringify({ idArticulo: id, tipo: 6 })
    }
    return this.http.get<ApiResponse>(`${this.url_old}Get`, {
      params
    }).pipe(
      map((response) => {
        let data = {
          product: {} as ProductSale,
          medidas: [] as MedidaProducto[],
          consolidacionesFecha: [] as any[]
        }

          if (response.code === "1") {
             data = ProductAdapter.fromApiSale(response)
          }

        return data;
      })
    )
  }

  checkNotificationStock<T extends {
    idArticulo: number
    cantidad: number
    idBodega: number
    idMedida: number
  }>(obj: T) {

    let params = {
      json: JSON.stringify({ ...obj, tipo: 7 })
    }
    return this.http.get(`${this.url_old}Get`, {
      params
    }).pipe(map((response: any) => ProductAdapter.fromApiCheckStockNotificacion(response)))

  }



  updateStatus(id: number) {
    return this.http.delete<ApiResponse>(`${this.url}${id}`)
  }

}
