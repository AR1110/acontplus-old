import { Directive, HostListener, inject, input, output } from '@angular/core';
import { AddEditModalComponent } from '@customer/ui/company-customer/components/add-edit-modal/add-edit-modal.component';
import { ModalService } from '@core/services/modal.service';
import { DialogService } from '@core/services/dialog.service';
import { CompanyCustomerAddEditDialogComponent } from './components/company-customer-add-edit-dialog/company-customer-add-edit-dialog.component';
import { CompanyCustomer } from '@customer/core/domain/company-customer';

@Directive({
  selector: '[appCompanyCustomerAddEdit]',
})
export class CompanyCustomerAddEditDirective {
  #modalSvc = inject(ModalService);
  private dialogSvc = inject(DialogService);

  companyCustomerSaved = output<CompanyCustomer>();
  id = input(0);
  openDialog = input(false);

  @HostListener('click', ['$event']) // Captura el evento click del DOM
  onClick(event: MouseEvent) {
    // Opcional: Detener la propagación o el comportamiento predeterminado
    event.preventDefault();
    event.stopPropagation();

    if (this.openDialog()) {
      this.dialogSvc
        .open(CompanyCustomerAddEditDialogComponent, {
          data: {
            id: this.id(),
          },
          size: 'xl',
        })
        .subscribe((result) => {
          if (result && typeof result === 'object') {
            this.companyCustomerSaved.emit(result);
          }
        });

      return;
    }

    const modalRef = this.#modalSvc.open(AddEditModalComponent, {
      size: 'xl',
    });

    modalRef.componentInstance.params = {
      id: this.id(),
    };

    modalRef.result.then((result) => {
      if (result && typeof result === 'object') {
        this.companyCustomerSaved.emit(result); // Emite el resultado a quien escucha este evento
      }
    });
  }
}
