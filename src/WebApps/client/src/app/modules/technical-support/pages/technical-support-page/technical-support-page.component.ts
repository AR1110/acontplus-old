import { Component, inject } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { DeviceDialogComponent } from '@modules/technical-support/components/device-dialog/device-dialog.component';
import { TechSupportModule } from '@modules/technical-support/tech-support.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from '@modules/technical-support/components/dashboard/dashboard.component';
import { OrderListComponent } from '../order-page/order-list/order-list.component';

@Component({
  selector: 'app-technical-support-page',
  standalone: true,
  imports: [TechSupportModule, OrderListComponent, DashboardComponent, NgbNavModule],
  templateUrl: './technical-support-page.component.html',
  styleUrl: './technical-support-page.component.scss'
})
export class TechnicalSupportPageComponent {
  active = 2;
  private modalRef = inject(ModalService);

  openTechSpec() {
    this.modalRef.openModalCustom(DeviceDialogComponent, { centered: true, size: 'xl' })
  }
}
