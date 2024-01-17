import { Component, OnInit, inject } from '@angular/core';
import { CompanyCustomerSearchComponent } from '@core/components/company-customer-search/company-customer-search.component';
import { isApiResponse } from '@core/models/api-response';
import { hideLoader, showLoader } from '@core/utils/loader';
import { DeviceService } from '@modules/technical-support/services/device.service';
// import { establecimientos } from '@modules/technical-support/store/tech-spec.store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-device-dialog',
  standalone: true,
  imports: [CompanyCustomerSearchComponent],
  templateUrl: './device-dialog.component.html',
  styles: ``,
})
export class DeviceDialogComponent implements OnInit {
  categories: any = [];
  data: any = {};
  dataDevice: any = {};
  establecimientos: any = [];
  private deviceService = inject(DeviceService);
  private modalRef = inject(NgbActiveModal);

  activeShowForm(accion: any, test: any) {
    console.log(accion);
    console.log(test);
  }

  get() {
    const self = this;
    showLoader();
    this.deviceService.get(JSON.stringify({ tipo: 1 })).subscribe({
      next(response) {
        if (isApiResponse(response)) {
          let { establecimientos } = JSON.parse(response.payload as string);
          self.establecimientos = establecimientos;
          // establecimientos.update(establecimientos)
        }
      },
      complete() {
        hideLoader();
      },
      error(error) {
        console.log(error);
        hideLoader();
      },
    });
  }

  ngOnInit(): void {
    this.get();
  }

  onCustomerSelected($event: any) {
    console.log($event);
  }

  saveDevice() {}

  resetFormDevice() {}

  closeModal() {
    this.modalRef.close();
  }
}
