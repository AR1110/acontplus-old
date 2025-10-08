import { BaseUseCase } from '@core/base-use-case';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '@inventory/product/domain/repositories/product.repository';
import {
  GetProductPurchaseResult,
  ProductDataForm,
  ProductGetIdResult,
  ValidateProductStockParams,
} from '@inventory/product/domain/entities/product.entity';
import { ApiResponse } from '@core/models/api-response';

//Listado general

@Injectable({
  providedIn: 'root',
})
export class ListProductWithPricesUseCase implements BaseUseCase<any, any> {
  private repo = inject(ProductRepository);
  execute = (params: any): Observable<any> => {
    return this.repo.listProductWithPrices(params);
  };
}

//Data form
@Injectable({
  providedIn: 'root',
})
export class ProductDataFormUseCase implements BaseUseCase<ProductDataForm, any> {
  private repo = inject(ProductRepository);

  execute() {
    return this.repo.getDataForm();
  }
}

//Get Id

@Injectable({
  providedIn: 'root',
})
export class ProductGetIdUseCase implements BaseUseCase<ProductGetIdResult, number> {
  private repo = inject(ProductRepository);

  execute(id: number) {
    return this.repo.getId(id);
  }
}

@Injectable({
  providedIn: 'root',
})
export class GetProductPurchaseUseCase implements BaseUseCase<GetProductPurchaseResult, number> {
  private repo = inject(ProductRepository);

  execute(id: number) {
    return this.repo.getForPurchase(id);
  }
}

//Validación Stock

@Injectable({
  providedIn: 'root',
})
export class ValidateProductStock implements BaseUseCase<ApiResponse, ValidateProductStockParams> {
  private repo = inject(ProductRepository);

  execute(params: ValidateProductStockParams) {
    return this.repo.checkNotificationStock(params);
  }
}
