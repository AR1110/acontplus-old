import { Directive, HostListener, inject, input, Input, output } from "@angular/core";
import { ModalService } from "@core/services/modal.service";
import { SubCategoryModalComponent } from "@inventory/ui/sub-category/components/sub-category-modal/sub-category-modal.component";

@Directive({
  selector: '[appSubCategoryModal]',
  standalone: true
})
export class SubCategoryModalDirective {
   onResult = output<any>();
    params = input({});

  @HostListener('click') onClick() {
    const modalRef = this.modalSvc.open(SubCategoryModalComponent);
    modalRef.componentInstance.params = this.params || {};
    modalRef.result.then((result: any) => {
      if (typeof result === 'object' && result.isRefresh) {
        this.onResult.emit(result);
      }
    })
  }
  constructor(private modalSvc: ModalService) { }
}
