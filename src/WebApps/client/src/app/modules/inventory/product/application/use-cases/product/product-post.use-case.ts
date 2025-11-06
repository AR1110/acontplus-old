import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ProductRepository } from '@inventory/product/domain/repositories/product.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';

// Define una interfaz para los parámetros
interface Params {
  id: number;
  data: any; // Si tienes una estructura específica, cámbialo por una interfaz/estructura definida
  dataPvp: any; // Lo mismo para estos dos
  dataUbicacion: any;
  file?: Blob;
}

@Injectable({
  providedIn: 'root',
})
export class ProductPostUseCase implements BaseUseCase<ApiResponseLegacy, Params> {
  private repo = inject(ProductRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Params): Observable<ApiResponseLegacy> {
    return this.repo.post(params, params.file);
  }
}
