import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ToastrNotificationService } from 'acontplus-utils';
import { QrWhatsappService } from '@modules/config/services/qr-whatsapp.service';
import Swal from 'sweetalert2';
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
    selector: 'app-qr-whatsapp-page',
  imports: [BreadcrumbComponent, MatCard, MatCardContent],
    templateUrl: './qr-whatsapp-page.component.html',
    styles: ``
})
export class QrWhatsappPageComponent {
  qrWhatsAppSvc = inject(QrWhatsappService);
  tS = inject(ToastrNotificationService);

  isLoggedIn = false;
  imgQR = 'data:image/png;base64,';
  message = '';
  wid = '';

  getSetting() {
    this.qrWhatsAppSvc.getSetting().subscribe((response) => {
      this.wid = response.wid;
    });
  }

  getQrCode() {
    this.qrWhatsAppSvc.getQrCode().subscribe((response) => {
      let { type, message } = response;
      if (type === 'qrCode') {
        this.imgQR = 'data:image/png;base64,' + message;
      }
    });
  }

  getStateInstance() {
    this.qrWhatsAppSvc.getStateInstance().subscribe((response) => {
      if (response.stateInstance === 'authorized') {
        this.isLoggedIn = true;
        this.getSetting();
      } else {
        this.getQrCode();
      }
    });
  }

  ngOnInit() {
    this.getStateInstance();
  }

  reconnect() {}

  logout() {
    this.qrWhatsAppSvc.logout().subscribe((response) => {
      if (response.isLogout) {
        this.tS.show({
          type: 'warning',
          message: 'Logout success',
        });
        this.isLoggedIn = false;
        this.getQrCode();
      }
    });
  }

  async askToLogout() {
    let { isConfirmed } = await Swal.fire({
      //title: '',
      text: 'Esta seguro de cerrar la session?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowOutsideClick: false,
    });
    if (isConfirmed) {
      this.logout();
    }
  }
}
