import { Component, inject, ViewChild } from '@angular/core';
import { DeviceListComponent } from './device-list/device-list.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DeviceModalComponent } from './device-modal/device-modal.component';
import { ModalService } from '@core/services/modal.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-device-page',
  standalone: true,
  imports: [BreadcrumbComponent, DeviceListComponent, FontAwesomeModule],
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
