import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PATHS, PATHS_API} from '@/enums/main.enum';
import {sanitizeAndEncodeURIComponent} from '@/core/utils/utils';
import {map} from "rxjs/operators";
import {ProductoConsolidacion, ProductSale, ProductSearchDto} from "@/models/inventory/product.model";
import {ApiResponse} from "@/models/api-response";
import {ProductAdapter} from "@/adapters/product.adapter";
import {MedidaProducto} from "@/models/inventory/medida.model";
import { getNoLoader } from '@/core/interceptors/loader.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = `${PATHS_API.INVENTORY}${PATHS.PRODUCT}`
  private http = inject(HttpClient)
  private productAdapter = inject(ProductAdapter)


  search<T extends { textSearch: string }>(obj: T) {
    const json = JSON.stringify({
      pageIndex: 1,
      pageSize: 30,
      busqueda: sanitizeAndEncodeURIComponent(obj.textSearch)
    })

    return this.http.get<ApiResponse>(`${this.url}Search?json=${json}`).pipe(
      map(response => {
        let results: ProductSearchDto[] = []
        if (response.code == "1") {
          const productsFound = JSON.parse(response.payload as string) ?? [];
          results = this.productAdapter.searchFrom(productsFound)
        }
        return results;
      })
    )
  }


  getForSale(productId: number, bodegaId?: number) {

    const json = JSON.stringify({
      idArticulo: productId,
      idBodega: bodegaId,
      tipo: 6
    })

    return this.http.get<ApiResponse>(`${this.url}Get?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response => {
        let results = {
          product: {} as ProductSale,
          medidas: [] as MedidaProducto[],
          productoConsolidaciones: [] as ProductoConsolidacion[]
        };
        if (response.code === "1") {
          const repositoryData = JSON.parse(response.payload as string);

          const [
            productRepos,
            medidasFraccionado,
            medidasPrincipal,
            productoConsolidaciones
          ] = repositoryData;

          const product = productRepos[0];

          results = this.productAdapter.saleFrom({
            product,
            medidasPrincipal,
            medidasFraccionado,
            productoConsolidaciones
          })

        }
        return results;
      })
    )
  }


  checkNotificationStock(obj: { idArticulo: number, cantidad: number, idBodega: number }) {
    let json = JSON.stringify({
      tipo: 7,
      ...obj
    })

    return this.http.get<ApiResponse>(`${this.url}Get?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response => {
        if (response.code === "0") {
          throw response;
        }
        let mainData = JSON.parse(response.payload as string);
        return mainData[0][0]

      })
    )
  }

}
