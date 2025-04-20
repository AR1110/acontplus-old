import { Component, OnInit, inject } from '@angular/core';
import { Device } from '@modules/technical-support/models/device.model';
import { DeviceModalComponent } from '../device-modal/device-modal.component';
import { DeviceService } from '@modules/technical-support/services/device.service';
import { ModalService } from '@core/services/modal.service';
import Swal from 'sweetalert2';
import { ToasterService } from '@core/services/toaster.service';
import { isApiResponse } from '@core/models/api-response';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';

@Component({
  selector: 'app-device-list',
  imports: [ThemeButtonComponent],
  templateUrl: './device-list.component.html',
  styles: ``,
})
export class DeviceListComponent implements OnInit {
  private modalSvc = inject(ModalService);
  private deviceService = inject(DeviceService);
  private tS = inject(ToasterService);

  devices: any = [];

  getCustomers(id: number) {}

  onEdit(item: Device) {
    const modalRef = this.modalSvc.openModalCustom(DeviceModalComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.data = item || {};
    modalRef.result.then((result) => {
      if (result !== null && typeof result === 'object') {
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
    this.deviceService.get({ tipo: 2 }).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        let tempArray = JSON.parse(response.payload as string);
        tempArray.devices.forEach((device: any) => {
          device.specs = JSON.parse(device.specs);
        });
        this.devices = tempArray.devices;
      }
    });
  }

  delete(item: Device) {
    this.deviceService.delete(item.id).subscribe((response) => {
      if (isApiResponse(response)) {
        this.tS.toastr({
          type: response.code == '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code == '1') {
          this.get();
        }
      }
    });
  }

  updateStatus(item: any) {
    item.enabled = item.enabled ? 0 : 1;
    this.deviceService.put(item.id, item).subscribe((response) => {
      if (isApiResponse(response)) {
        if (response.code == '0') {
          this.tS.toastr({
            type: 'warning',
            message: response.message,
          });
        } else {
          this.get();
        }
      }
    });
  }

  ngOnInit(): void {
    this.get();
  }
}
