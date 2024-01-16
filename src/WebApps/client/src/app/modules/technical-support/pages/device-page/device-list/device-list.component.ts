import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { isApiResponse } from '@core/models/api-response';
import { hideLoader } from '@core/utils/loader';
import { Device } from '@modules/technical-support/models/device.model';
import { DeviceService } from '@modules/technical-support/services/device.service';
// import { devices } from '@modules/technical-support/store/device.store';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [],
  templateUrl: './device-list.component.html',
  styles: ``,
})
export class DeviceListComponent implements OnInit {
  // devices: Device[] = [];
  devices: any = [];
  private deviceService = inject(DeviceService);

  get() {
    const self = this;
    this.deviceService.get(JSON.stringify({ tipo: 2 })).subscribe({
      next(response) {
        if (isApiResponse(response)) {
          let tempArray = JSON.parse(response.payload as string);
          console.log(tempArray);
          self.devices = tempArray.devices;
          // devices.update(tempArray['devices']);
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
}
