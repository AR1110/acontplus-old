import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { hideLoader, showLoader } from '@core/utils';
import { ControlCaja } from '@modules/accounting/models/cashbox.model';
import { ControlCajaService } from '@modules/accounting/services/control-caja.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';
import { AccountingModule } from '@modules/accounting/accounting.module';
import { ModalService } from '@core/services/modal.service';
import { CashboxCloseModalComponent } from '../cashbox-close-modal/cashbox-close-modal.component';
@Component({
  selector: 'app-movimiento-caja-modal',
  standalone: true,
  imports: [AppModule, AccountingModule],
  templateUrl: './movimiento-caja-modal.component.html',
  styleUrl: './movimiento-caja-modal.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MovimientoCajaModalComponent {
  @Input("paramds") params = {
    idCaja: 0
  }
  private activeModal = inject(NgbActiveModal);
  private controlCajaSvc = inject(ControlCajaService);
  private modalSvc = inject(ModalService)

  dataSearch = {
    pageIndex: 1,
    pageSize: 10,
    maxSize: 5

  }

  page = 1;

  totalRecords = 0;
  recordsQuantity = [10, 25, 50, 100, 200, 500];

  movimientosCaja: Array<ControlCaja> = [];

  getMovimientosCaja() {
    console.log(this.params)
    let dataSearch = {
      idCaja: this.params.idCaja,
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize
    }
    showLoader();
    this.controlCajaSvc.getAll(dataSearch).subscribe({
      next: (response) => {
        hideLoader();

        const { movimientos } = response as { movimientos: Array<ControlCaja> }
        console.log(response)
        this.movimientosCaja = movimientos;
        this.totalRecords = this.movimientosCaja.length > 0 ? this.movimientosCaja[0].totalRecords : 0
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }

  ngOnInit() {

    this.getMovimientosCaja();

  }

  pageChanged(): void {
    this.getMovimientosCaja();
  }

  changePageSize(): void {
    this.dataSearch.pageIndex = 1;
    this.getMovimientosCaja();
  }


  openModalCashboxClose(params: ControlCaja) {
    const modalRef = this.modalSvc.openModalCustom(CashboxCloseModalComponent, { centered : true});
    modalRef.componentInstance.params = params || {};
    modalRef.result.then(result => {
      console.log(result)
      if (typeof result === 'object') {
        this.getMovimientosCaja();
      }
    })
  }


  closeModal() {
    this.activeModal.close();
  }
}
