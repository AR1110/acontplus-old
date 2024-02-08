import { Component, OnInit, inject } from '@angular/core';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { DeviceService } from '@modules/technical-support/services/device.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-device-list-modal',
  standalone: true,
  imports: [AppModule],
  templateUrl: './device-list-modal.component.html',
  styles: ``,
})
export class DeviceListModalComponent implements OnInit {
  private deviceService = inject(DeviceService);
  private modalRef = inject(NgbActiveModal);
  private tS = inject(ToasterService);

  data: any = {};
  devices: any = [];
  closeModal() {
    this.modalRef.close();
  }

  ngOnInit(): void {
    this.deviceService
      .get(
        JSON.stringify({
          tipo: 4,
          customerCompanyId: this.data.customerCompanyId,
        })
      )
      .subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            let { devices } = JSON.parse(response.payload as string) || [];
            this.devices = devices;
            if (this.devices.length == 0) {
              this.modalRef.close();
              this.tS.toastr({
                type: 'info',
                message: 'El cliente no cuenta con equipos registrados',
              });
            }
          }
        },
      });
  }
  select(device: any) {
    this.modalRef.close(device);
  }
}
