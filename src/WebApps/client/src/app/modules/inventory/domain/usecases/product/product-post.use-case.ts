import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ProductRepository } from '@inventory/domain/repositories/product.repository';
import { ApiResponse } from '@core/models/api-response';
import { Observable } from 'rxjs';

// Define una interfaz para los parámetros
interface  Params {
  id: number;
  data: any;         // Si tienes una estructura específica, cámbialo por una interfaz/estructura definida
  dataPvp: any;      // Lo mismo para estos dos
  dataUbicacion: any;
  file?: Blob;
}

@Injectable({
  providedIn: 'root',
})
export class ProductPostUseCase implements BaseUseCase<ApiResponse, Params> {
  constructor(private repo: ProductRepository) {}

  execute(params: Params): Observable<ApiResponse> {
    return this.repo.post(params, params.file);
  }
}
