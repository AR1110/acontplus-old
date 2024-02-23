import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ProductAddEditModalComponent } from '../pages/product-page/components/product-add-edit-modal/product-add-edit-modal.component';
import { ModalService } from '@core/services/modal.service';
import { SubCategoryModalComponent } from '../pages/sub-category-page/sub-category-modal/sub-category-modal.component';

// @Directive({
//   selector: '[appMarcaAddUpdate]',
//   standalone: true
// })
// export class MarcaAddUpdateDirective {
//   @Input() resultModalHandler!: Function;
//   @Input() params = {};
//   @HostListener('click') onClick() {
//     const modalRef = this.modalSvc.openModalCustom(MarcaModalComponent);
//     modalRef.componentInstance.params = this.params || {};
//     modalRef.result.then(result => {
//       if (this.resultModalHandler && typeof result === 'object') {
//         this.resultModalHandler(result);
//       }
//     })
//   }
//   constructor(private modalSvc: ModalService) { }
// }

// @Directive({
//   selector: '[appModelAddUpdate]',
//   standalone: true
// })
// export class ModelAddUpdateDirective {
//   @Input() resultModalHandler!: Function;
//   @Input() params = {};
//   @HostListener('click') onClick() {
//     const modalRef = this.modalSvc.openModalCustom(ModelModalComponent);
//     modalRef.componentInstance.params = this.params || {};
//     modalRef.result.then(result => {
//       if (this.resultModalHandler && typeof result === 'object') {
//         this.resultModalHandler(result);
//       }
//     })
//   }
//   constructor(private modalSvc: ModalService) { }
// }

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
