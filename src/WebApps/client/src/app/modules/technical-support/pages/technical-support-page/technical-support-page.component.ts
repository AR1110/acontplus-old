import { Component, ViewChild, inject } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from '@modules/technical-support/components/dashboard/dashboard.component';
import { OrderListComponent } from '../order-page/order-list/order-list.component';
import { OrderModalComponent } from '../order-page/order-modal/order-modal.component';
import { AppModule } from 'src/app/app.module';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-technical-support-page',
  standalone: true,
  imports: [
    AppModule,
    RouterLink,
    BreadcrumbComponent,
    DashboardComponent,
    NgbNavModule,
    OrderListComponent,
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
      if(response!==null && typeof response==='object'){
        this.child.get();
      }
    });
  }

  onNavChange($event: any){
    setTimeout(()=>{
      this.child.get();
    }, 400)
  }
}
