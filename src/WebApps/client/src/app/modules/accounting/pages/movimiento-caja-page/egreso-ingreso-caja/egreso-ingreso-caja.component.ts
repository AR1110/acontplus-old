import { Component, inject } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { AppModule } from 'src/app/app.module';
import { MovimientoCajaService } from '@modules/accounting/services/movimiento-caja.service';
import { ModalEgresoIngresoComponent } from './modal-egreso-ingreso/modal-egreso-ingreso.component';
import { MovimientoCajaRead } from '@modules/accounting/models/movimiento-caja.model';

@Component({
  selector: 'app-egreso-ingreso-caja',
  standalone: true,
  imports: [AppModule],
  templateUrl: './egreso-ingreso-caja.component.html',
  styleUrl: './egreso-ingreso-caja.component.scss'
})
export class EgresoIngresoCajaComponent {

  private modalSvc = inject(ModalService);
  private movCajaSvc = inject(MovimientoCajaService);
  totalRecords = 0;

  dataSearch = {
    pageIndex: 1,
    pageSize: 10,
    maxSize: 5
  }

  movimientosCaja: Array<MovimientoCajaRead> = [];

  getMovimientosCaja() {
    let params = {
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize
    }
    this.movCajaSvc.getAll(params).subscribe({
      next: (response) => {
        this.movimientosCaja = response || [];
        this.totalRecords = this.movimientosCaja.length > 0 ? this.movimientosCaja[0].totalRecords : 0;
      }
    })
  }
  ngOnInit() {
    this.getMovimientosCaja()
  }

  openModal(params?: any) {
    const modalRef = this.modalSvc.openModalCustom(ModalEgresoIngresoComponent, { size: 'lg' });
    modalRef.componentInstance.params = params || {};
    modalRef.result.then(result => {
      console.log(result)
      if (typeof result === 'object') {

      }
    })
  }

  pageChanged() {

  }


}
