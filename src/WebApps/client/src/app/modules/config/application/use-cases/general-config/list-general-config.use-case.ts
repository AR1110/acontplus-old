import {inject, Injectable} from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import { Observable } from 'rxjs';
import {GeneralConfigRepository} from "@modules/config/domain/repositories/general-config.repository";
import {GeneralConfigResponse} from "@modules/config/domain/models/general-config.model";
import {ApiResponse} from "@core/models/api-response";

@Injectable({
  providedIn: 'root',
})
export class ListGeneralConfigUseCase implements BaseUseCase<GeneralConfigResponse, string> {
  private repo = inject(GeneralConfigRepository)
  execute(params: string): Observable<GeneralConfigResponse> {
       return this.repo.list(params)
    }
}


@Injectable({
  providedIn: 'root',
})
export class SendMaxEstablishmentsUseCase implements BaseUseCase<ApiResponse | null, any> {
  private repo = inject(GeneralConfigRepository)
  execute(): Observable<ApiResponse | null> {
    return this.repo.sendMaxEstablishments()
  }
}


@Injectable({
  providedIn: 'root',
})
export class SendMaxDocumentsUseCase implements BaseUseCase<ApiResponse | null, any> {
  private repo = inject(GeneralConfigRepository)
  execute(): Observable<ApiResponse | null> {
    return this.repo.sendMaxDocuments()
  }
}

@Injectable({
  providedIn: 'root',
})
export class SendMaxUsersUseCase implements BaseUseCase<ApiResponse | null, any> {
  private repo = inject(GeneralConfigRepository)
  execute(): Observable<ApiResponse | null> {
    return this.repo.sendMaxUsers()
  }
}

@Injectable({
  providedIn: 'root',
})
export class SendMaxWarehousesUseCase implements BaseUseCase<ApiResponse | null, any> {
  private repo = inject(GeneralConfigRepository)
  execute(): Observable<ApiResponse | null> {
    return this.repo.sendMaxWarehouses()
  }
}

@Injectable({
  providedIn: 'root',
})
export class SendMaxInventoryItemsUseCase implements BaseUseCase<ApiResponse | null, any> {
  private repo = inject(GeneralConfigRepository)
  execute(): Observable<ApiResponse | null> {
    return this.repo.sendMaxInventoryItems()
  }
}
