import { inject, Injectable } from "@angular/core";
import { ModalService } from "@core/services/modal.service";

import { ProductAddEditModalComponent } from "../components/product/product-add-edit-modal/product-add-edit-modal.component";
import { ProductKardexModalComponent } from "../components/product/product-kardex-modal/product-kardex-modal.component";

@Injectable({
  providedIn: 'root'
})
export class OpenModalProductService {
  private modalSvc = inject(ModalService);


  async open<T extends { id: number }>(data?: T) {
    let modalRef = this.modalSvc.openModalCustom(ProductAddEditModalComponent, {
      size: 'xl'
    })
    modalRef.componentInstance.data = {
      id: data?.id
    }

    await modalRef.result.then(result => {
      return result;
    })

  }

  async openKardex<T extends { id: number }>(data?: T) {
    let modalRef = this.modalSvc.openModalCustom(ProductKardexModalComponent, {
      size: 'xl'
    })
    modalRef.componentInstance.data = {
      id: data?.id
    }

    // await modalRef.result.then(result => {
    //   return result;
    // })

  }

}
