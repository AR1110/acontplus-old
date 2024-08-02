import { Directive, HostListener, Input } from "@angular/core";
import { ModalService } from "@core/services/modal.service";

// @Directive({
//   selector: '[appBrandAddEdit]',
//   standalone: true
// })
// export class BrandAddEditDirective {
//   @Input() resultModalHandler!: Function;
//   @Input() params = {};
//   @HostListener('click') onClick() {
//     const modalRef = this.modalSvc.openModalCustom(BrandAddEditModalComponent);
//     modalRef.componentInstance.params = this.params || {};
//     modalRef.result.then((result: unknown) => {
//       if (this.resultModalHandler && typeof result === 'object') {
//         this.resultModalHandler(result);
//       }
//     })
//   }
//   constructor(private modalSvc: ModalService) { }
// }

