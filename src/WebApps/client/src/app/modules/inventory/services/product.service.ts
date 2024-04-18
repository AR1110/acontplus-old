import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { GroupedEstab } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { map, Observable } from 'rxjs';

import { ProductAdapter } from '../adapters/product.adapter';
import { INVENTORY_PATHS } from '../enums/inventory.enum';
import { ProductSearch } from '../models/product.model';
import { MedidaProducto } from '../shared/models/measure.model';
import { groupSubCategoryUtil } from '../utils/group-sub-category.util';
import { mergeMeasureUtil } from '../utils/merge-measure.util';
import { ProductSale } from './../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.PRODUCT}`;

  private productAdapter = new ProductAdapter()

  getDataFilter() {
    let params = JSON.stringify({ tipo: 11 })
    return this.http.get(`${this.url}Get?json=${params}`).pipe(
      map(response => {
        let data = {
          subCategorias: [],
          medidas: [],
          marcas: [],
          modelos: [],
          tarifasImpuesto: []
        };
        if (isApiResponse(response)) {
          let [subCategorias, medidas, marcas, modelos, tarifasImpuesto] = JSON.parse(response.payload as string);
          data = {
            subCategorias,
            medidas,
            marcas,
            modelos,
            tarifasImpuesto
          }
        }
        return data;
      })
    )
  }

  getDataForm(){
    let params = {
      json: JSON.stringify({ tipo: 1 })
    }
    return this.http.get(`${this.url}Get`, {
      params
    }).pipe(map((response: any) => response.payload))
  }

  getAll<T extends { pageIndex: number, pageSize: number }>(obj: T) {
    let params = {
      json: JSON.stringify({ ...obj, tipo: 1 })
    }
    return this.http.get(`${this.url}Get`, {
      params
    }).pipe(map((response: any) => response.payload))
  }

  get(params: any) {
    return this.http
      .get(`${this.url}Get?json=${params}`)
      .pipe(map((response) => response));
  }

  search<T extends { textSearch: string }>(
    data: T
  ): Observable<Array<ProductSearch>> {
    let query = {
      pageIndex: 1,
      pageSize: 15,
      busqueda: data.textSearch,
    };
    return this.http
      .get(`${this.url}Search?json=${JSON.stringify(query)}`)
      .pipe(
        map((response) => {
          if (isApiResponse(response)) {
            let results = response.payload && JSON.parse(response.payload as string) || [];
            let products = this.productAdapter.searchFrom(results);
            return products;
          }
          return [];
        })
      );
  }


  getDataReport() {
    let params = {
      json: JSON.stringify({ tipo: 13 })
    }
    return this.http.get(`${this.url}Get`, {
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
        if (isApiResponse(response)) {
          let [tempEstabs, tempSubCategorias, marcas, tempTipoDocumento, tarifas] = JSON.parse(response.payload as string);

          let estabs = groupEstabUtil({
            bodegas: tempEstabs,
            isGroupBodega: true
          })
          let subCategorias = groupSubCategoryUtil(tempSubCategorias);
          data.estabs = estabs;
          data.subCategorias = subCategorias;
          data.marcas = marcas;
          data.tarifas = tarifas;
          data.tiposDoc = tempTipoDocumento;
        }
        return data;
      })
    )
  }


  getForSale(id: number) {
    let params = {
      json: JSON.stringify({ idArticulo: id, tipo: 6 })
    }
    return this.http.get(`${this.url}Get`, {
      params
    }).pipe(
      map((response) => {
        let data = {
          product: {} as ProductSale,
          medidas: [] as MedidaProducto[],
          consolidacionesFecha: [] as any[]
        }
        if (isApiResponse(response)) {
          if (response.code === "1") {
            let [
              product,
              medidasFraccionadoTemp,
              medidasPrincipalTemp,
              consolidacionesFechaTemp
            ] = JSON.parse(response.payload as string)

            data.product = product[0];

            data.medidas = mergeMeasureUtil(medidasPrincipalTemp, medidasFraccionadoTemp);


            data.consolidacionesFecha = consolidacionesFechaTemp.map((data: any) => ({
              ...data,
              fechaConsolidacion: data.fechaConsolidacion && new Date(data.fechaConsolidacion)
            }))

          }
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
    return this.http.get(`${this.url}Get`, {
      params
    }).pipe(map((response: any) => {
      const responseApi = JSON.parse(response.payload)[0][0];


      return responseApi;
    }))

  }
}
