import {inject, Injectable} from "@angular/core";
import {ProductRepository} from "@domain/repositories/product.repository";
import {PATHS, PATHS_API} from "@domain/enums/main.enum";
import {HttpClient} from "@angular/common/http";
import {
  ProductSearchParams,
  ProductSearchDto,
  GetSaleProductParams,
  GetSaleProductResponse,
  CheckStockProps,
} from "@/domain/models/inventory/product.model";
import {Observable} from "rxjs";
import {ApiResponse, withoutSpinner} from "acontplus-utils";
import {map} from "rxjs/operators"
import {SearchProductMapper} from "@data/repositories/product/search-product.mapper";
import {GetSaleProductMapper} from "@data/repositories/product/get-sale-product.mapper";
import {CheckStockMapper} from "@data/repositories/product/check-stock.mapper";

@Injectable({
  providedIn: 'root'
})
export class ProductRepositoryImpl implements ProductRepository {
  checkStock(params: CheckStockProps): Observable<ApiResponse> {
    const json = CheckStockMapper.toJson(params);

    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map((response) => CheckStockMapper.fromJson(response))
    );
  }

  getSale(params: GetSaleProductParams): Observable<GetSaleProductResponse> {
      const json =  GetSaleProductMapper.toJson(params)
      return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
        map((response) =>GetSaleProductMapper.fromJson(response))
      );
  }
   search(params: ProductSearchParams): Observable<ProductSearchDto[]> {

    const json = SearchProductMapper.toJson(params)

    return this.http
      .get<ApiResponse>(`${this.url}Search?json=${json}`, {
        context: withoutSpinner(),
      })
      .pipe(
        map((response) => SearchProductMapper.fromJson(response)),
      );
  }
  private url = `${PATHS_API.INVENTORY}${PATHS.PRODUCT}`;
  private http = inject(HttpClient);

}
