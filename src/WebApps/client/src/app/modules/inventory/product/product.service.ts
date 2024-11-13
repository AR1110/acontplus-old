import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { ApiResponse, isApiResponse } from '@core/models/api-response';
import { GroupedEstab } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { map, Observable } from 'rxjs';

import { ProductAdapter } from '../adapters/product.adapter';
import { INVENTORY_PATHS } from '../enums/inventory.enum';
import { MedidaProducto } from '../models/measure.model';
import { ProductSearch } from '../models/product.model';
import { groupSubCategoryUtil } from '../utils/group-sub-category.util';
import { mergeMeasureUtil } from '../utils/merge-measure.util';
import { ProductSale } from './../models/product.model';
import { GroupedSubFamilia } from './../models/sub-category.model';
import { C } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private url_old = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.PRODUCT_OLD}`;
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.PRODUCT_OLD}`;



  private productAdapter = new ProductAdapter()

  getDataFilter() {
    let params = JSON.stringify({ tipo: 11 })
    return this.http.get<ApiResponse>(`${this.url}?json=${params}`, {
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
          let { subCategorias, medidas, marcas, modelos, tiposIva } = JSON.parse(response.payload as string);
          data = {
            subCategorias: groupSubCategoryUtil(subCategorias),
            medidas,
            marcas,
            modelos,
            tiposIva
          }
        }
        return data;
      })
    )
  }

  getDataForm() {
    let params = {
      json: JSON.stringify({ tipo: 5 })
    }
    return this.http.get<ApiResponse>(`${this.url}`, {
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
          const {
            estabBodegas,
            decimal,
            categorias,
            subCategorias,
            medidas,
            modelos,
            marcas,
            tiposArticulo,
            tiposIva,
            tiposIce,
            tarifas,
            etiquetas
          } = JSON.parse(response.payload as string);

          result.categorias = categorias;
          result.decimal = decimal[0];
          result.estabs = groupEstabUtil({
            bodegas: estabBodegas,
            isGroupBodega: true
          })

          result.etiquetas = etiquetas;
          result.marcas = marcas;
          result.medidas = medidas;
          result.modelos = modelos;
          result.subCategorias = subCategorias;

          result.subCategoriasGroup = groupSubCategoryUtil(subCategorias)

          result.tarifas = tarifas;
          result.tiposArticulo = tiposArticulo;
          result.tiposIce = tiposIce;
          result.tiposIva = tiposIva;
        }
        return result;
      })
    )
  }

  getAll<T extends { pageIndex: number, pageSize: number }>(obj: T) {
    let params = {
      json: JSON.stringify({ ...obj, tipo: 1 })
    }
    return this.http.get<ApiResponse>(`${this.url}`, {
      params,
      context: getNoLoader()
    }).pipe(map((response) => {
      let result = {
        products: [] as any[]
      }
      if (response.code === "1") {
        let { articulos } = JSON.parse(response.payload as string);

        let products = articulos || [];

        result.products = products.map((item: any) => {
          return {
            idArticulo: item.idArticulo,
            idMedida: item.idMedida,
            code_unique: item.code_unique,
            codigo: item.codigo,
            descripcion: item.descripcion,
            precioCosto: item.precioCosto,
            estado: item.estado,
            stock: item.stock,
            observaciones: item.observaciones,
            imagen: item.imagen,
            subFamilia: item.subFamilia,
            medida: item.medida,
            tipoIva: item.tipoIva,
            tipoArticulo: item.tipoArticulo,
            totalRecords: item.totalRecords,
            style: item.style,
            s3ObjectKey: item.s3ObjectKey,
            s3ObjectUrl: item.s3ObjectUrl
          }
        })
      }

      return result;

    }))
  }

  get(params: any) {
    return this.http
      .get(`${this.url_old}Get?json=${params}`)
      .pipe(map((response) => response));
  }

  search<T extends { textSearch: string, pageIndex?: number, pageSize?: number }>(
    data: T
  ): Observable<Array<ProductSearch>> {
    let query = {
      pageIndex: data.pageIndex ?? 1,
      pageSize: data.pageSize ?? 15,
      busqueda: data.textSearch,
    };
    return this.http
      .get(`${this.url_old}Search?json=${JSON.stringify(query)}`, {
        context: getNoLoader()
      })
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
    return this.http.get(`${this.url_old}Get`, {
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
    return this.http.get(`${this.url_old}Get`, {
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
    return this.http.get(`${this.url_old}Get`, {
      params
    }).pipe(map((response: any) => {
      const responseApi = JSON.parse(response.payload)[0][0];


      return responseApi;
    }))

  }



  updateStatus(id: number) {
    return this.http.delete<ApiResponse>(`${this.url}Delete/${id}`)
  }

}
