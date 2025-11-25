import { DynamicCard } from '@acontplus/ng-components';
import { Component, inject, ViewChild } from '@angular/core';
import { DeviceListComponent } from './device-list/device-list.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DeviceModalComponent } from './device-modal/device-modal.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-device-page',
  imports: [DynamicCard, BreadcrumbComponent, DeviceListComponent, MatButton, MatIcon],
  templateUrl: './device-page.component.html',
  styles: ``,
})
export class DevicePageComponent {
  @ViewChild(DeviceListComponent) child!: DeviceListComponent;
  private modalService = inject(DialogService);
  onModalOpen() {
    const modalRef = this.modalService.open(DeviceModalComponent, {
      size: 'xl',
    });
    modalRef.subscribe((response) => {
      if (response !== null && typeof response === 'object') {
        this.child.get();
      }
    });
  }
}
