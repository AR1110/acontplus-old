import { Component, inject, Input } from '@angular/core';

import * as XLSX from 'xlsx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ControlCajaUseCase } from '@accounting/core/use-cases/control-caja.use-case';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-detalle-arqueo-control-caja-modal-modal',
  imports: [MatIcon, MatButton],
  templateUrl: './detalle-arqueo-control-caja-modal.component.html',
})
export class DetalleArqueoControlCajaModalComponent {
  activeModal = inject(NgbActiveModal);
  dataSearch = {
    sortByDefault: 0,
    sortOrder: 'ASC',
  };
  @Input() params = {} as any;
  private _controlCajaUseCase = inject(ControlCajaUseCase);

  arqueoCajaDetalle: any[] = [];
  total = 0;

  getInfoAdicional() {
    this.arqueoCajaDetalle = [];
    this._controlCajaUseCase
      .getArqueoCaja(this.params.id)
      .subscribe((response) => {
        this.arqueoCajaDetalle = response.arqueoCajaDetalle || [];
        this.total = this.arqueoCajaDetalle.reduce(
          (acc, current) => acc + current.total,
          0,
        );
      });
  }

  ngOnInit() {
    this.getInfoAdicional();
  }

  exportToExcel(data: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  exportData() {
    this.exportToExcel(this.arqueoCajaDetalle, 'arqueoCajaDetalle');
  }
}
