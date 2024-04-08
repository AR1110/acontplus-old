import { Component, Input, OnInit, inject } from '@angular/core';
import { isApiResponse } from '@core/models/api-response';
import { hideLoader, showLoader } from '@core/utils/loader';
import { DeviceCustomerService } from '@modules/technical-support/services/device.customer.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-device-customer-modal',
  standalone: true,
  imports: [AppModule],
  templateUrl: './device-customer-modal.component.html',
  styles: ``,
})
export class DeviceCustomerModalComponent implements OnInit {
  private activeModal = inject(NgbActiveModal);
  private modalRef = inject(NgbActiveModal);
  private deviceCustomerService = inject(DeviceCustomerService);

  @Input() params = {    
    deviceId: 0,
  };

  ngOnInit(): void {
    this.get();
  }

  get() {
    showLoader();
    this.deviceCustomerService.get(JSON.stringify({ 
      tipo: 1,
      deviceId: this.params.deviceId
    })).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          console.log(JSON.parse(response.payload as string));
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
}
