import { Component, inject, ViewChild } from '@angular/core';
import { DeviceListComponent } from './device-list/device-list.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DeviceModalComponent } from './device-modal/device-modal.component';
import { ModalService } from '@core/services/modal.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-device-page',
  imports: [
    BreadcrumbComponent,
    DeviceListComponent,
    MatCard,
    MatCardContent,
    MatButton,
    MatIcon,
  ],
  templateUrl: './device-page.component.html',
  styles: ``,
})
export class DevicePageComponent {
  @ViewChild(DeviceListComponent) child!: DeviceListComponent;
  private modalService = inject(ModalService);
  onModalOpen() {
    const modalRef = this.modalService.openModalCustom(DeviceModalComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.result.then((response) => {
      if (response !== null && typeof response === 'object') {
        this.child.get();
      }
    });
  }
}
