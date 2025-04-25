
import { Observable } from "rxjs";
import {
  CheckStockProps,
  GetSaleProductParams,
  GetSaleProductResponse,
  ProductSearchDto,
  ProductSearchParams
} from "@domain/models/inventory/product.model";
import {ApiResponse} from "acontplus-utils";

export abstract class ProductRepository {
  abstract search(params: ProductSearchParams): Observable<ProductSearchDto[]>;
  abstract getSale(params: GetSaleProductParams): Observable<GetSaleProductResponse>;
  abstract checkStock(params: CheckStockProps): Observable<ApiResponse>;
}
