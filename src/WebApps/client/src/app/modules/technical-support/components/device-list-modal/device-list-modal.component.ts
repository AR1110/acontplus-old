import { Component, OnInit, inject, signal } from '@angular/core';
import { isApiResponse } from '@core/models/api-response';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { DeviceService } from '@modules/technical-support/services/device.service';

import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';

@Component({
  selector: 'app-device-list-modal',
  imports: [ThemeButtonComponent, MatCustomDialogComponent],
  templateUrl: './device-list-modal.component.html',
  styles: ``,
})
export class DeviceListModalComponent implements OnInit {
  private deviceService = inject(DeviceService);
  private modalRef = inject(MatDialogRef<DeviceListModalComponent>);
  private tS = inject(ToastrNotificationService);

  data = inject<any>(MAT_DIALOG_DATA);
  devices = signal<any>([]);
  onModalClose() {
    this.modalRef.close();
  }

  ngOnInit(): void {
    this.deviceService
      .get({
        tipo: 4,
        customerCompanyId: this.data.customerCompanyId,
      })
      .subscribe((response) => {
        if (isApiResponse(response)) {
          const { devices } = JSON.parse(response.payload as string) || [];
          this.devices.set(devices);
          if (this.devices().length == 0) {
            this.modalRef.close();
            this.tS.show({
              type: 'info',
              message: 'El cliente no cuenta con equipos registrados',
            });
          }
        }
      });
  }
  select(device: any) {
    this.modalRef.close(device);
  }
}
