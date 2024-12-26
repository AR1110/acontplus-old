import { Directive, HostListener, inject, input, Input, output } from "@angular/core";
import { BrandAddEditModalComponent } from "@inventory/ui/brand-page/brand-add-edit-modal/brand-add-edit-modal.component";
import {DialogService} from "@core/services/dialog.service";

@Directive({
  selector: '[appBrandAddEdit]',
  standalone: true
})
export class BrandAddEditDirective {
  private _dialogSvc = inject(DialogService)
  onResult = output<any>();
  params = input({});

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    $event.stopPropagation();
    const modalRef = this._dialogSvc.open(BrandAddEditModalComponent, {
      data: structuredClone(this.params()) || {}
    });
    modalRef.subscribe((result: any) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    })
  }
}

