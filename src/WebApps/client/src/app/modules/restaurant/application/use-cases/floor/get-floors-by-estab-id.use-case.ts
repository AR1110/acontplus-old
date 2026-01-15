import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { FloorRepository } from '@restaurant/data/repositories/floor.repository';
import { GetFloorsByEstabIdResponse } from '@restaurant/data/models/floor.model';

@Injectable({
  providedIn: 'root',
})
export class GetFloorsByEstabIdUseCase implements BaseUseCase<GetFloorsByEstabIdResponse, any> {
  private repo = inject(FloorRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  execute(params: any) {
    return this.repo.getByEstablishmentId(params);
  }
}
