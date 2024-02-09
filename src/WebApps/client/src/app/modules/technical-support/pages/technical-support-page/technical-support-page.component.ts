import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { TechSupportModule } from '@modules/technical-support/tech-support.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from '@modules/technical-support/components/dashboard/dashboard.component';
import { OrderListComponent } from '../order-page/order-list/order-list.component';
import { OrderModalComponent } from '../order-page/order-modal/order-modal.component';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-technical-support-page',
  standalone: true,
  imports: [
    AppModule,
    TechSupportModule,
    OrderListComponent,
    DashboardComponent,
    NgbNavModule,
  ],
  templateUrl: './technical-support-page.component.html',
  styles: ``,
})
export class TechnicalSupportPageComponent {
  @ViewChild(OrderListComponent) child!: OrderListComponent;
  private modalRef = inject(ModalService);
  active = 2;
  
  openOrderModal() {
    const modalResp = this.modalRef.openModalCustom(OrderModalComponent, {
      centered: true,
      size: 'xl',
    });
    modalResp.result.then((response) => {
      this.child.get();
    });
  }
}
