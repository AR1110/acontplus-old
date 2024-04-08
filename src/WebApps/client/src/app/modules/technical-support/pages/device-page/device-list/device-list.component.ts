import { AppModule } from 'src/app/app.module';
import { Component, OnInit, inject } from '@angular/core';
import { Device } from '@modules/technical-support/models/device.model';
import { DeviceModalComponent } from '../device-modal/device-modal.component';
import { DeviceService } from '@modules/technical-support/services/device.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { isApiResponse } from '@core/models/api-response';
import { ModalService } from '@core/services/modal.service';
import Swal from 'sweetalert2';
import { ToasterService } from '@core/services/toaster.service';

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
  private tS = inject(ToasterService);

  devices: any = [];

  getCustomers(id: number) {}

  edit(item: Device) {
    const modalRef = this.modalSvc.openModalCustom(DeviceModalComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.params = item || {};
    modalRef.result.then((result) => {
      if (result.code == '1') {
        this.get();
      }
    });
  }

  askToDelete(item: Device) {
    Swal.fire({
      title: '¿Estas seguro/a?',
      text: `Se eliminara este dispositivo ${item.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Eliminar!`,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.delete(item);
      }
    });
  }

  get() {
    showLoader();
    this.deviceService.get(JSON.stringify({ tipo: 2 })).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          let tempArray = JSON.parse(response.payload as string);

          tempArray.devices.forEach((device: any) => {
            device.specs = JSON.parse(device.specs);
          });
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

  delete(item: Device) {
    showLoader();
    this.deviceService.delete(item.id).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '0') {
            this.tS.toastr({
              type: 'warning',
              message: response.message,
            });
            return;
          }

          this.tS.toastr({
            type: 'success',
            message: response.message,
          });
          this.get();
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

  updateStatus(item: any) {
    showLoader();
    item.enabled = item.enabled ? 0 : 1;
    this.deviceService.put(item.id, item).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '0') {
            this.tS.toastr({
              type: 'warning',
              message: response.message,
            });
            return;
          }
          this.get();
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
