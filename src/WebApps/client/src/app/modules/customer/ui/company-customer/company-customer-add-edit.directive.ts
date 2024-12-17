import { Directive, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { AddEditModalComponent } from '@customer/ui/company-customer/components/add-edit-modal/add-edit-modal.component';
import { ModalService } from '@core/services/modal.service';

@Directive({
  selector: '[appCompanyCustomerAddEdit]',
  standalone: true,
})
export class CompanyCustomerAddEditDirective {
  #modalSvc = inject(ModalService);

  @Output() onResult = new EventEmitter();
  @Input() id = 0;
  @HostListener('click')
  onClick() {
    let modalRef = this.#modalSvc.open(AddEditModalComponent, {
      size: 'xl'
    })
    modalRef.componentInstance.params = {
      id: this.id,
    }

    modalRef.result.then(result => {
      if (result !== null && typeof result === 'object') {
        this.onResult.emit(result)
      }
    })

  }



}
