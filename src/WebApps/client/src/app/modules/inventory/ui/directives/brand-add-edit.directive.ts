import { Directive, HostListener, inject, input, Input, output } from "@angular/core";
import { ModalService } from "@core/services/modal.service";
import { BrandAddEditModalComponent } from "@inventory/ui/brand-page/brand-add-edit-modal/brand-add-edit-modal.component";

@Directive({
  selector: '[appBrandAddEdit]',
  standalone: true
})
export class BrandAddEditDirective {
  private modalSvc = inject(ModalService)
  onResult = output<any>();
  params = input({});

  @HostListener('click') onClick() {
    const modalRef = this.modalSvc.open(BrandAddEditModalComponent);
    modalRef.componentInstance.params = this.params() || {};
    modalRef.result.then((result: any) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    })
  }
}

