import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ListMovimientoCajaResponse } from '@accounting/data/models/movimiento-caja.model';
import { MovimientoCajaRepository } from '@accounting/data/repositories/movimiento-caja.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListMovimientoCajaUseCase implements BaseUseCase<ListMovimientoCajaResponse, any> {
  private repo = inject(MovimientoCajaRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  execute(params: any): Observable<ListMovimientoCajaResponse> {
    return this.repo.getAll(params);
  }
}
