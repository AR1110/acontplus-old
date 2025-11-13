import { ProformaInvoiceRepository } from '@sale/domain/repositories/proforma-invoice.repository';
import { BaseUseCase } from '@core/base-use-case';
import { inject, Injectable } from '@angular/core';
import { ProformaInvoiceListResult } from '@sale/domain/models/proforma-invoice';

@Injectable({
  providedIn: 'root',
})
export class ProformaInvoiceFilterUseCase implements BaseUseCase<any, any> {
  private repo = inject(ProformaInvoiceRepository);
  execute() {
    return this.repo.getFilters();
  }
}

@Injectable({
  providedIn: 'root',
})
export class ProformaInvoiceListUseCase implements BaseUseCase<any, ProformaInvoiceListResult> {
  private repo = inject(ProformaInvoiceRepository);
  execute(params: any) {
    return this.repo.getAll(params);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ProformaInvoiceViewDetailUseCase implements BaseUseCase<number, any> {
  private repo = inject(ProformaInvoiceRepository);
  execute(id: number) {
    return this.repo.viewDetail(id);
  }
}
