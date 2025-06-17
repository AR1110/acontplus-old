import { Directive, HostListener, inject, input, output } from '@angular/core';
import { DialogService } from '@core/services/dialog.service';
import { CompanyCustomerAddEditDialogComponent } from '@company-customer/presentation/components/company-customer-add-edit-dialog/company-customer-add-edit-dialog.component';
import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';

@Directive({
  selector: '[appCompanyCustomerAddEdit]',
})
export class CompanyCustomerAddEditDirective {
  private dialogSvc = inject(DialogService);

  companyCustomerSaved = output<CompanyCustomerEntity>();
  id = input(0);

  @HostListener('click', ['$event']) // Captura el evento click del DOM
  onClick(event: MouseEvent) {
    // Opcional: Detener la propagación o el comportamiento predeterminado
    event.preventDefault();
    event.stopPropagation();

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
}
