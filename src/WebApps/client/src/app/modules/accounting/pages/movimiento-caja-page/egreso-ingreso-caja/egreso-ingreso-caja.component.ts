import { Component, inject } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { AppModule } from 'src/app/app.module';
import { ModalEgresoIngresoComponent } from './modal-egreso-ingreso/modal-egreso-ingreso.component';

@Component({
  selector: 'app-egreso-ingreso-caja',
  standalone: true,
  imports: [AppModule],
  templateUrl: './egreso-ingreso-caja.component.html',
  styleUrl: './egreso-ingreso-caja.component.scss'
})
export class EgresoIngresoCajaComponent {

  private modalSvc = inject(ModalService);
  
  totalRecords = 0;

  dataSearch = {
    pageIndex: 1,
    pageSize: 10,
    maxSize: 5
  }

  openModal(params?: any){
    const modalRef = this.modalSvc.openModalCustom(ModalEgresoIngresoComponent, {size: 'lg'});
    modalRef.componentInstance.params = params || {};
    modalRef.result.then(result => {
      console.log(result)
      if (typeof result === 'object') {
         
      }
    })
  }

  pageChanged(){

  }


}
