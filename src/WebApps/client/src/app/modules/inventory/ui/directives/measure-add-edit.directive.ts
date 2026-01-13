import { Directive, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import { MeasureAddEdit } from '@inventory/ui/measure-page/measure-add-edit/measure-add-edit';
import { MeasureRead } from '@inventory/data/models/measure.model';
import { DialogService } from '@core/services/dialog.service';

@Directive({
  selector: '[appMeasureAddEdit]',
})
export class MeasureAddEditDirective {
  private _dialogSvc = inject(DialogService);

  @Output() onResultModal = new EventEmitter();
  @Input() params = {} as MeasureRead;
  @Input() id = 0;
  @HostListener('click', ['$event'])
  onClick($event: MouseEvent) {
    $event.stopPropagation();
    const modalRef = this._dialogSvc.open(MeasureAddEdit, {
      data: {
        ...this.params,
        id: this.params.idMedida,
      },
    });
    modalRef.subscribe((result: any) => {
      if (this.onResultModal && typeof result === 'object') {
        this.onResultModal.emit(result);
      }
    });
  }

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: any[]);
  constructor() {}
}
