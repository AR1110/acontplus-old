import { inject, Injectable } from '@angular/core';
import { RetencionAtsRepository } from '../repositories/retencion-ats.repository';

@Injectable({
  providedIn: 'root',
})
export class RetencionAtsUseCase {
  private readonly _retencionAtsRepository = inject(RetencionAtsRepository);

  getAll<T>(parameters: T) {
    return this._retencionAtsRepository.getAll(parameters);
  }
}
