import { inject, Injectable } from "@angular/core";
import { ModalService } from "@core/services/modal.service";

import { ProductAddEditModalComponent } from "@inventory/product/components/product-add-edit-modal/product-add-edit-modal.component";
import { ProductKardexModalComponent } from "@inventory/product/components/product-kardex-modal/product-kardex-modal.component";

@Injectable({
  providedIn: 'root'
})
export class OpenModalProductService {
  private modalSvc = inject(ModalService);


  async open<T extends { id: number }>(data?: T) {
    let modalRef = this.modalSvc.open(ProductAddEditModalComponent, {
      size: 'xl'
    })
    modalRef.componentInstance.params = {
      id: data?.id
    }

    await modalRef.result.then(result => {
      return result;
    })

  }

  async openKardex<T extends { id: number }>(data?: T) {
    let modalRef = this.modalSvc.open(ProductKardexModalComponent, {
      size: 'xl',
      scrollable: true
    })
    modalRef.componentInstance.params = {
      id: data?.id
    }

    // await modalRef.result.then(result => {
    //   return result;
    // })

  }

}
