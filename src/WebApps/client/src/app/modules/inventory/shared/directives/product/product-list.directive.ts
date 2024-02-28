import { Directive, HostListener, Input } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { ProductAddEditModalComponent } from '@inventory/components/product/product-add-edit-modal/product-add-edit-modal.component';



@Directive({
  selector: '[appProductAddEdit]',
  standalone: true
})
export class ProductAddEditDirective {
  @Input() resultModalHandler!: Function;
  @HostListener('click') onClick() {
    const modalRef = this.modalSvc.openModalCustom(ProductAddEditModalComponent, {
      size: 'xl',
    });
    modalRef.result.then((result: unknown) => {
      if (this.resultModalHandler && typeof result === 'object') {
        this.resultModalHandler(result);
      }
    })
  }
  constructor(private modalSvc: ModalService) { }
}


/**
 * Category
 */


/**
 * Category
 */
// @Directive({
//   selector: '[appMeasureModal]',
//   standalone: true
// })
// export class MeasureModalDirective {
//   @Input() resultModalHandler!: Function;
//   @Input() params = {};

//   @HostListener('click') onClick() {
//     const modalRef = this.modalSvc.openModalCustom(MeasureModalComponent);
//     modalRef.componentInstance.params = this.params || {};
//     modalRef.result.then(result => {
//       if (this.resultModalHandler && typeof result === 'object') {
//         this.resultModalHandler(result);
//       }
//     })
//   }
//   constructor(private modalSvc: ModalService, private el: ElementRef) { }
// }
