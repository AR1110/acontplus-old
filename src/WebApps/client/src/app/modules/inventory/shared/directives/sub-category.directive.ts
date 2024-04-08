import { Directive, HostListener, Input } from "@angular/core";
import { SubCategoryModalComponent } from "@modules/inventory/shared/components/sub-category/sub-category-modal/sub-category-modal.component";
import { ModalService } from "@core/services/modal.service";

@Directive({
  selector: '[appSubCategoryModal]',
  standalone: true
})
export class SubCategoryModalDirective {
  @Input() resultModalHandler!: Function;
  @Input() params = {};

  @HostListener('click') onClick() {
    const modalRef = this.modalSvc.openModalCustom(SubCategoryModalComponent);
    modalRef.componentInstance.params = this.params || {};
    modalRef.result.then((result: unknown) => {
      if (this.resultModalHandler && typeof result === 'object') {
        this.resultModalHandler(result);
      }
    })
  }
  constructor(private modalSvc: ModalService) { }
}
