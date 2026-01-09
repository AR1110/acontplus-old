import { Directive, HostListener, inject, input, Input, output } from '@angular/core';
import { BrandAddEdit } from '@inventory/ui/brand-page/brand-add-edit/brand-add-edit';
import { DialogService } from '@core/services/dialog.service';

@Directive({
  selector: '[appBrandAddEdit]',
})
export class BrandAddEditDirective {
  private _dialogSvc = inject(DialogService);
  onResult = output<any>();
  params = input({});

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    $event.stopPropagation();
    const modalRef = this._dialogSvc.open(BrandAddEdit, {
      data: structuredClone(this.params()) || {},
    });
    modalRef.subscribe((result: any) => {
      if (result && typeof result === 'object') {
        this.onResult.emit(result);
      }
    });
  }
}
