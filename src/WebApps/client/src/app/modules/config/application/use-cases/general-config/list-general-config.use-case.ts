import { inject, Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';
import { GeneralConfigRepository } from '@modules/config/data/repositories/general-config.repository';
import { GeneralConfigResponse } from '@modules/config/data/models/general-config.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class ListGeneralConfigUseCase implements BaseUseCase<GeneralConfigResponse, string> {
  private repo = inject(GeneralConfigRepository);
  execute(params: string): Observable<GeneralConfigResponse> {
    return this.repo.list(params);
  }
}

@Injectable({
  providedIn: 'root',
})
export class SendMaxEstablishmentsUseCase implements BaseUseCase<ApiResponseLegacy | null, any> {
  private repo = inject(GeneralConfigRepository);
  execute(): Observable<ApiResponseLegacy | null> {
    return this.repo.sendMaxEstablishments();
  }
}

@Injectable({
  providedIn: 'root',
})
export class SendMaxDocumentsUseCase implements BaseUseCase<ApiResponseLegacy | null, any> {
  private repo = inject(GeneralConfigRepository);
  execute(): Observable<ApiResponseLegacy | null> {
    return this.repo.sendMaxDocuments();
  }
}

@Injectable({
  providedIn: 'root',
})
export class SendMaxUsersUseCase implements BaseUseCase<ApiResponseLegacy | null, any> {
  private repo = inject(GeneralConfigRepository);
  execute(): Observable<ApiResponseLegacy | null> {
    return this.repo.sendMaxUsers();
  }
}

@Injectable({
  providedIn: 'root',
})
export class SendMaxWarehousesUseCase implements BaseUseCase<ApiResponseLegacy | null, any> {
  private repo = inject(GeneralConfigRepository);
  execute(): Observable<ApiResponseLegacy | null> {
    return this.repo.sendMaxWarehouses();
  }
}

@Injectable({
  providedIn: 'root',
})
export class SendMaxInventoryItemsUseCase implements BaseUseCase<ApiResponseLegacy | null, any> {
  private repo = inject(GeneralConfigRepository);
  execute(): Observable<ApiResponseLegacy | null> {
    return this.repo.sendMaxInventoryItems();
  }
}
