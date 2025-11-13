import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { NotaEntregaRepository } from '@sale/domain/repositories/nota-entrega.repository';
import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotaEntregaUseCase {
  private repo = inject(NotaEntregaRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getDataFilter(): Observable<any> {
    return this.repo.getDataFilter();
  }
  getAll<T>(obj: T): Observable<any> {
    return this.repo.getAll(obj);
  }
  getDetalleCompleto(id: number): Observable<any> {
    return this.repo.getDetalleCompleto(id);
  }
  post<T>(obj: T): Observable<ApiResponseLegacy> {
    return this.repo.post<T>(obj);
  }
  put<T>(id: number, obj: T): Observable<ApiResponseLegacy> {
    return this.repo.put(id, obj);
  }
}
