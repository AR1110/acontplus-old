import {inject, Injectable} from "@angular/core";
import {PATHS_API} from "@core/constants/global.constants";
import {HttpClient} from "@angular/common/http";
import {ApiResponse } from "@core/models/api-response";
import {map, Observable} from "rxjs";
import {ProductRepository} from "@inventory/core/repositories/product.repository";
import {getNoLoader} from "@core/interceptors/loader.interceptor";
import {INVENTORY_PATHS} from "@inventory/core/enums/inventory.enum";
import {ProductDeprecatedMapper} from "@inventory/data/product/product-deprecated.mapper";
import {GroupedEstab} from "@core/models/estab.model";
import {GroupedSubFamilia} from "@inventory/core/domain/sub-category.model";
import {ProductSale, ProductSearch} from "@inventory/core/domain/product.model";
import {MedidaProducto} from "@inventory/core/domain/measure.model";


@Injectable({
  providedIn: 'root'
})
export class ProductDeprecatedRepository extends ProductRepository{

  private _url =   `${PATHS_API.INVENTORY}${INVENTORY_PATHS.PRODUCT_OLD}`;
  private _http = inject(HttpClient);


  constructor() {
    super();
  }


  getDataFilter() {
    let params = JSON.stringify({ tipo: 11 })
    return this._http.get<ApiResponse>(`${this._url}Get?json=${params}`, {
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
          data = ProductDeprecatedMapper.fromApiDataFilter(response)
        }
        return data;
      })
    )
  }

  getAll<T  >(obj: T) {
    let params = {
      json: JSON.stringify({ ...obj, tipo: 1 })
    }
    return this._http.get<ApiResponse>(`${this._url}Get`, {
      params,
      context: getNoLoader()
    }).pipe(map((response) => {
      let result = {
        products: [] as any[],
        totalRecords: 0,
      }
      if (response.code === "1") {
        result.products = ProductDeprecatedMapper.fromApiGetAll(response);

        result.totalRecords = result.products.length>0? result.products[0].totalRecords : 0;
      }

      return result;

    }))
  }



  getDataForm() {
    let params = {
      json: JSON.stringify({ tipo: 5 })
    }
    return this._http.get<ApiResponse>(`${this._url}Get`, {
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
          result = ProductDeprecatedMapper.fromApiDataForm(response)
        }
        return result;
      })
    )
  }


  search<T extends { textSearch: string, pageIndex?: number, pageSize?: number }>(
    data: T
  ): Observable<Array<ProductSearch>> {
    let json = JSON.stringify(  {
      pageIndex: data.pageIndex ?? 1,
      pageSize: data.pageSize ?? 15,
      busqueda: data.textSearch,
    } )
    return this._http
      .get<ApiResponse>(`${this._url}Search?json=${json}`, {
        context: getNoLoader()
      })
      .pipe(
        map((response) => {
          if (response.code==="1") {
            let results = response.payload && JSON.parse(response.payload as string) || [];
            return ProductDeprecatedMapper.searchFrom(results);
          }
          return [];
        })
      );
  }


  getForSale(id: number) {
    let params = {
      json: JSON.stringify({ idArticulo: id, tipo: 6 })
    }
    return this._http.get<ApiResponse>(`${this._url}Get`, {
      params
    }).pipe(
      map((response) => {
        let data = {
          product: {} as ProductSale,
          medidas: [] as MedidaProducto[],
          consolidacionesFecha: [] as any[]
        }

        if (response.code === "1") {
          data = ProductDeprecatedMapper.fromApiSale(response)
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
    return this._http.get(`${this._url}Get`, {
      params
    }).pipe(map((response: any) => ProductDeprecatedMapper.fromApiCheckStockNotificacion(response)))

  }

  getDataReport() {
    let params = {
      json: JSON.stringify({ tipo: 13 })
    }
    return this._http.get<ApiResponse>(`${this._url}Get`, {
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
          data = ProductDeprecatedMapper.fromApiDataReport(response)
        }
        return data;
      })
    )
  }

  updateStatus(id: number) {
    return this._http.delete<ApiResponse>(`${this._url}${id}`)
  }





}
