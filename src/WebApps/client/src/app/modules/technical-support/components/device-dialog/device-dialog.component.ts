import { Component, inject } from '@angular/core';
import { CompanyCustomerSearchComponent } from '@core/components/company-customer-search/company-customer-search.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-device-dialog',
  standalone: true,
  imports: [CompanyCustomerSearchComponent],
  templateUrl: './device-dialog.component.html',
  styles: ``
})
export class DeviceDialogComponent {
  categories: any = []
  data: any = {}
  dataDevice: any = {}

  private modalRef = inject(NgbActiveModal)



  activeShowForm(accion: any, test: any) {
    console.log(accion)
    console.log(test)
  }

  onCustomerSelected($event: any) {
    console.log($event)
  }

  saveDevice() {

  }

  resetFormDevice() {

  }


  closeModal() {
    this.modalRef.close()
  }
}
