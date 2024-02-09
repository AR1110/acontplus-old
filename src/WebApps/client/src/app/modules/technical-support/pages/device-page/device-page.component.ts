import { Component, inject } from '@angular/core';
import { TechSupportModule } from '@modules/technical-support/tech-support.module';
import { DeviceListComponent } from './device-list/device-list.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DeviceModalComponent } from './device-modal/device-modal.component';
import { ModalService } from '@core/services/modal.service';

@Component({
  selector: 'app-device-page',
  standalone: true,
  imports: [BreadcrumbComponent, TechSupportModule, DeviceListComponent],
  templateUrl: './device-page.component.html',
  styles: ``,
})
export class DevicePageComponent {
  private modalService = inject(ModalService);
  openDialog() {
    const modalRef = this.modalService.openModalCustom(DeviceModalComponent, {
      size: 'lg',
      centered: true,
    });
  }
}
