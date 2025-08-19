import {Component, OnInit, inject, signal} from '@angular/core';
import { Device } from '@modules/technical-support/models/device.model';
import { DeviceModalComponent } from '../device-modal/device-modal.component';
import { DeviceService } from '@modules/technical-support/services/device.service';
import Swal from 'sweetalert2';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { isApiResponse } from '@core/models/api-response';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import {DialogService} from "@core/services/dialog.service";

@Component({
  selector: 'app-device-list',
  imports: [ThemeButtonComponent],
  templateUrl: './device-list.component.html',
  styles: ``,
})
export class DeviceListComponent implements OnInit {
  private modalSvc = inject(DialogService);
  private deviceService = inject(DeviceService);
  private tS = inject(ToastrNotificationService);

  devices = signal<any>([])

  getCustomers(id: number) {}

  onEdit(item: Device) {
    const modalRef = this.modalSvc.open(DeviceModalComponent, {
      size: 'lg',
      data: item || {},
    });
    modalRef.subscribe((result) => {
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
        const tempArray = JSON.parse(response.payload as string);
        tempArray.devices.forEach((device: any) => {
          device.specs = JSON.parse(device.specs);
        });
        this.devices.set(tempArray.devices)
      }
    });
  }

  delete(item: Device) {
    this.deviceService.delete(item.id).subscribe((response) => {
      if (isApiResponse(response)) {
        this.tS.show({
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
          this.tS.show({
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
