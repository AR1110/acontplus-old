import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { isApiResponse } from '@core/models/api-response';
import { hideLoader } from '@core/utils/loader';
import { Device } from '@modules/technical-support/models/device.model';
import { DeviceService } from '@modules/technical-support/services/device.service';
import { AppModule } from 'src/app/app.module';
// import { devices } from '@modules/technical-support/store/device.store';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [AppModule],
  templateUrl: './device-list.component.html',
  styles: ``,
})
export class DeviceListComponent implements OnInit {
  private deviceService = inject(DeviceService);
  devices: any = [];
  categories: any = [];

  getCustomers(id: number) {}
  askToDelete(item: any) {}
  edit(item: any) {}

  getDataForm() {
    this.deviceService.get(JSON.stringify({ tipo: 1 })).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          const tempArray = JSON.parse(response.payload as string);
          this.categories = tempArray.categorias;
        }
      },
      complete() {
        hideLoader();
      },
      error(error) {
        console.log(error);
        hideLoader();
      },
    })
  }

  get() {
    this.deviceService.get(JSON.stringify({ tipo: 2 })).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          let tempArray = JSON.parse(response.payload as string);
          this.devices = tempArray.devices;
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
    this.getDataForm();
    this.get();
  }
}
