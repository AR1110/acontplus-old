import { AppModule } from 'src/app/app.module';
import { Component, OnInit, inject } from '@angular/core';
import { Device } from '@modules/technical-support/models/device.model';
import { DeviceModalComponent } from '../device-modal/device-modal.component';
import { DeviceService } from '@modules/technical-support/services/device.service';
import { hideLoader } from '@core/utils/loader';
import { isApiResponse } from '@core/models/api-response';
import { ModalService } from '@core/services/modal.service';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [AppModule],
  templateUrl: './device-list.component.html',
  styles: ``,
})
export class DeviceListComponent implements OnInit {
  private modalSvc = inject(ModalService);
  private deviceService = inject(DeviceService);

  devices: any = [];

  getCustomers(id: number) {}
  askToDelete(item: any) {}

  edit(item: Device) {
    console.log(item);
    const modalRef = this.modalSvc.openModalCustom(DeviceModalComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.params = item || {};
    modalRef.result.then((result) => {
      if (result) {
        console.log('result result');
        console.log(result);
      }
    });
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
    this.get();
  }
}
