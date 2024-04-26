import { Component, inject } from "@angular/core"
import { ModalService } from "@core/services/modal.service"
import { ProductContentPopupComponent } from "./product-content-popup/product-content-popup.component"


@Component({
  selector: 'app-product-search-popup',
  standalone: true,
  imports: [

  ],
  templateUrl: './product-search-popup.component.html',
  styleUrl: './product-search-popup.component.scss',
})
export class ProductSearchPopupComponent {
  modalSvc = inject(ModalService)


  onInputFocus(): void {

    let modalRef = this.modalSvc.open(ProductContentPopupComponent, {
      size: 'xl',
      keyboard: true,
      backdrop: 'static',
      centered: true
    })

    modalRef.result.then(result=>{
      console.log(result)
    })

  }

}


