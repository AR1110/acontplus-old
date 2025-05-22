import { inject, Injectable } from '@angular/core';
import { DocumentoElectronicoRepository } from '@billing/domain/repositories/documento-electronico.repository';
import { Observable } from 'rxjs';
import { FilterData } from '@billing/domain/models/documento-electronico.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentoElectronicoUseCase {
  private readonly _documentoElectronicoRepository = inject(
    DocumentoElectronicoRepository,
  );

  authorize(id: number) {
    return this._documentoElectronicoRepository.authorize(id);
  }

  getFilters(forceRefresh = false) {
    return this._documentoElectronicoRepository.getFilters(forceRefresh);
  }
  get filterData$(): Observable<FilterData | null> {
    return this._documentoElectronicoRepository.filterData$;
  }
  refreshFilters() {
    return this._documentoElectronicoRepository.refreshFilters();
  }

  getAll<T>(obj: T) {
    return this._documentoElectronicoRepository.getAll(obj);
  }

  cancel(id: number) {
    return this._documentoElectronicoRepository.cancel(id);
  }
  downloadXml(id: number) {
    return this._documentoElectronicoRepository.downloadXml(id);
  }
}
