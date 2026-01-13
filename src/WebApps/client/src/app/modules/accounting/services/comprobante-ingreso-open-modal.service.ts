import { inject, Injectable } from '@angular/core';
import { ComprobanteIngresoLoteModalComponent } from '@accounting/ui/comprobante-ingreso/components/comprobante-ingreso-lote-modal/comprobante-ingreso-lote-modal.component';
import { DialogService } from '@core/services/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class ComprobanteIngresoOpenModalService {
  #modalSvc = inject(DialogService);

  async open<T>(data: T) {
    const modalRef = this.#modalSvc.open(ComprobanteIngresoLoteModalComponent, {
      size: 'xl',
      data: structuredClone(data),
    });
    await modalRef.subscribe((result) => {
      return result;
    });
  }
}
