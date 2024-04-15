
import { inject, Injectable } from "@angular/core";
import { ModalService } from "@core/services/modal.service";
import { ComprobanteIngresoLoteModalComponent } from "@modules/accounting/pages/cuenta-por-cobrar-page/components/comprobante-ingreso-lote-modal/comprobante-ingreso-lote-modal.component";

@Injectable({
  providedIn: 'root'
})
export class ComprobanteIngresoOpenModalService {
  #modalSvc = inject(ModalService);

  async open<T>(data: T){
    let modalRef = this.#modalSvc.openModalCustom(ComprobanteIngresoLoteModalComponent, {
      size: 'xl'
    })
    modalRef.componentInstance.params = data;
    await modalRef.result.then(result=>{
      return result;
    })
  }
}
