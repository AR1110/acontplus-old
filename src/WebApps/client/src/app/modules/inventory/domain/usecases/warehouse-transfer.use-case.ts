import {inject, Injectable} from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import {WarehouseTransferRepository} from "@inventory/domain/repositories/warehouse-transfer.repository";
import {WarehouseTransferDataFormResult} from "@inventory/domain/models/warehouse-transfer";

@Injectable({
  providedIn: 'root',
})
export class WarehouseTransferUseCase {
  private repo = inject(WarehouseTransferRepository);

  getAll<T>(obj: T) {
    return this.repo.getAll(obj);
  }

  getDataFilter() {
    return this.repo.getDataFilter();
  }

  post<T>(data: T) {
    return this.repo.post(data);
  }

  put<T>(id: number, data: T) {
    return this.repo.put(id, data);
  }

  updateStatus(id: number) {
    return this.repo.updateStatus(id);
  }
}


@Injectable({
  providedIn: 'root',
})
export class WarehouseTransferDataFormUseCase implements BaseUseCase<WarehouseTransferDataFormResult, any>{
  private repo = inject(WarehouseTransferRepository);

  execute() {
    return this.repo.getDataForm();
  }
}

@Injectable({
  providedIn: 'root',
})
export class GetMassTransferProductsUseCase implements BaseUseCase<any, any>{
  private repo = inject(WarehouseTransferRepository);
  execute(obj:any) {
    return this.repo.getMassTransferProducts(obj);
  }
}

@Injectable({
  providedIn: 'root',
})
export class WarehouseTransferGenerateSerieUseCase implements BaseUseCase<any, { puntoEmisionId: number }>{
  private repo = inject(WarehouseTransferRepository);
  execute(obj:any) {
    return this.repo.generateSerie(obj);
  }
}

@Injectable({
  providedIn: 'root',
})
export class WarehouseTransferSaveUseCase implements BaseUseCase<any, any>{
  private repo = inject(WarehouseTransferRepository);
  execute(obj:any) {
    return this.repo.post(obj);
  }
}
