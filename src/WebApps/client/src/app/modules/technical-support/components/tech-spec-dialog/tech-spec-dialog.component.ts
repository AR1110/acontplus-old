import { Component } from '@angular/core';
import { CompanyCustomerSearchComponent } from '@core/components/company-customer-search/company-customer-search.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tech-spec-dialog',
  standalone: true,
  imports: [CompanyCustomerSearchComponent],
  templateUrl: './tech-spec-dialog.component.html',
  styleUrl: './tech-spec-dialog.component.scss'
})
export class TechSpecDialogComponent {
  data: any = {}
  dataDevice: any = {}
  categories: any = []
  constructor(private modalRef: NgbActiveModal) {

  }
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
