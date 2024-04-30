import { Directive, HostListener, inject } from '@angular/core';
import { ModalService } from '@core/services/modal.service';

@Directive({
  selector: '[appCompanyCustomerAddEdit]',
  standalone: true,
})
export class CompanyCustomerAddEditDirective {
  #modalSvc = inject(ModalService);


  @HostListener('event.click')
  onClick(){
    console.log('this')
  }



}
