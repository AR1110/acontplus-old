import { Component, inject, Input } from '@angular/core';
import { ControlCajaService } from '@accounting/services/control-caja.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as XLSX from 'xlsx';
import {
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-detalle-arqueo-control-caja-modal',
    imports: [FontAwesomeModule],
    templateUrl: './detalle-arqueo-control-caja-modal.component.html',
    styles: ``
})
export class DetalleArqueoControlCajaModalComponent {
  activeModal = inject(NgbActiveModal);
  dataSearch = {
    sortByDefault: 0,
    sortOrder: 'ASC',
  };
  @Input() params = {} as any;
  private controlCajaSvc = inject(ControlCajaService);

  arqueoCajaDetalle: any[] = [];
  total = 0;

  getInfoAdicional() {
    this.arqueoCajaDetalle = []
    this.controlCajaSvc.getArqueoCaja(this.params.id).subscribe(response => {
      this.arqueoCajaDetalle = response.arqueoCajaDetalle || [];
      this.total = this.arqueoCajaDetalle.reduce((acc, current) => acc + current.total, 0)
    })
  }

  ngOnInit() {
    this.getInfoAdicional()
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
