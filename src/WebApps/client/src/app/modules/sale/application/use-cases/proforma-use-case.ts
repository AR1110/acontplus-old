import { ProformaRepository } from '@sale/domain/repositories/proforma.repository';
import { BaseUseCase } from '@core/base-use-case';
import { inject, Injectable } from '@angular/core';
import { ProformaInvoiceListResult } from '@sale/domain/models/proforma';

@Injectable({
  providedIn: 'root',
})
export class ProformaInvoiceFilterUseCase implements BaseUseCase<any, any> {
  private repo = inject(ProformaRepository);
  execute() {
    return this.repo.getFilters();
  }
}

@Injectable({
  providedIn: 'root',
})
export class ProformaInvoiceListUseCase implements BaseUseCase<any, ProformaInvoiceListResult> {
  private repo = inject(ProformaRepository);
  execute(params: any) {
    return this.repo.getAll(params);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ProformaInvoiceViewDetailUseCase implements BaseUseCase<number, any> {
  private repo = inject(ProformaRepository);
  execute(id: number) {
    return this.repo.viewDetail(id);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ProformaInvoiceGetFormDataUseCase implements BaseUseCase<any, any> {
  private repo = inject(ProformaRepository);
  execute() {
    return this.repo.getFormData();
  }
}
