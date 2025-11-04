import { Component, Input, OnInit, inject } from '@angular/core';
import { isApiResponse } from '@core/models/api-response';

import { DeviceCustomerService } from '@modules/technical-support/services/device.customer.service';

@Component({
  selector: 'app-device-customer-modal',
  imports: [],
  templateUrl: './device-customer-modal.component.html',
  styles: ``,
})
export class DeviceCustomerModalComponent implements OnInit {
  private deviceCustomerService = inject(DeviceCustomerService);

  @Input() params = {
    deviceId: 0,
  };

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.deviceCustomerService
      .get(
        JSON.stringify({
          tipo: 1,
          deviceId: this.params.deviceId,
        }),
      )
      .subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            console.log(JSON.parse(response.payload as string));
          }
        },
        complete() {},
        error(error) {
          console.log(error);
        },
      });
  }
}
