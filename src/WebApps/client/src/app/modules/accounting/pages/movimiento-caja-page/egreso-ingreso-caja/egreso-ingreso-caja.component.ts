import { Component, inject } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { AppModule } from 'src/app/app.module';
import { MovimientoCajaService } from '@modules/accounting/services/movimiento-caja.service';
import { ModalEgresoIngresoComponent } from './modal-egreso-ingreso/modal-egreso-ingreso.component';
import { MovimientoCajaRead } from '@modules/accounting/models/movimiento-caja.model';
import { hideLoader, showLoader } from '@core/utils/loader';
import { CODE_REPORT } from '@core/constants/global.constants';
import { SharedService } from '@core/services/shared.service';

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
  private sharedSvc = inject(SharedService)
  totalRecords = 0;

  dataSearch = {
    pageIndex: 1,
    pageSize: 10,
    maxSize: 5
  }
  page = 1; 
  recordsQuantity = [10, 25, 50, 100, 200, 500];


  movimientosCaja: Array<MovimientoCajaRead> = [];

  getMovimientosCaja() {
    let params = {
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize
    }
    showLoader();
    this.movCajaSvc.getAll(params).subscribe({
      next: (response) => {
        hideLoader();
        this.movimientosCaja = response || [];
        this.totalRecords = this.movimientosCaja.length > 0 ? this.movimientosCaja[0].totalRecords : 0;
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }
  ngOnInit() {
    this.getMovimientosCaja()
  }

  refresh() {
    this.getMovimientosCaja()
  }

  openModal(params?: any) {
    const modalRef = this.modalSvc.openModalCustom(ModalEgresoIngresoComponent, { size: 'lg', backdrop: "static" });
    modalRef.componentInstance.params = params || {};
    modalRef.result.then(result => {
      if (typeof result === 'object') {
        this.getMovimientosCaja();
      }
    })
  }

  getPrint(item: MovimientoCajaRead) {
    let parameters = {
      idDocument: item.idMovimientoCaja,
      idTipoDocumento: item.idTipoDocumento,
      codEstab: item.codEstab,
      codDoc: item.codDoc,
      nroIdentificacion: item.nroIdentificacion
    }

    this.sharedSvc.askToPrint({
      parameters: JSON.stringify(parameters)
    })

  }

  getReport(item: MovimientoCajaRead) {
    try { 
      let format = 'pdf';
      let dataParms = {
        id: item.idMovimientoCaja,
      }



      const parameters = {
        hasService: true,
        reportParams: JSON.stringify({
          hasParams: false,
          codigo: CODE_REPORT.RMIE,
          format,
          codEstab: item.codEstab,
          aditionalParams: []
        }),
        dataParams: JSON.stringify(dataParms)
      }

      this.sharedSvc.getReport(parameters, "pdf", true)

      // this._commonSvc.getReport({
      //   parameters,
      //   formatType: format
      // })
    } catch (error) {
      console.log(error)
    }
  }



  pageChanged(): void {
    this.getMovimientosCaja();
  }

  changePageSize(): void {
    this.dataSearch.pageIndex = 1;
    this.getMovimientosCaja();
  }


}
