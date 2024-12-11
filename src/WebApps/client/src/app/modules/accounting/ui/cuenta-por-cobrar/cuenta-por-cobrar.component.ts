import { SelectionModel } from '@angular/cdk/collections';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { DOC_TYPE, DOC_TYPE_SRI } from '@core/constants/global.constants';
import { GroupedEstab } from '@core/models/estab.model';
import { ToasterService } from '@core/services/toaster.service';
import { isValidField } from '@core/utils/utils';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ComprobanteIngresoOpenModalService } from '@accounting/services/comprobante-ingreso-open-modal.service';
import { Pagination } from '@shared/models/pagination.model';
import { forkJoin } from 'rxjs';
import { formatDateToString } from '@core/utils/date.util';
import {CuentaPorCobrarUsecase} from "@accounting/core/usecases/cuenta-por-cobrar.usecase";



@Component({
    selector: 'app-cuenta-por-cobrar',
    imports: [
        MatTableModule,
        MatCheckboxModule,
        FormsModule,
        FontAwesomeModule,
        BreadcrumbComponent,
        DateRangeSelectionComponent
    ],
    templateUrl: './cuenta-por-cobrar.component.html',
    styles: ``
})
export class CuentaPorCobrarComponent {

  private _cuentaPorCobrarUseCase = inject(CuentaPorCobrarUsecase)
  tS = inject(ToasterService);
  comprobanteIngresoOpenModalSvc = inject(ComprobanteIngresoOpenModalService)

  displayedColumns: string[] = [
    'select',
    'index',
    'tipoDoc',
    'serieComprobante',
    'razonSocialComprador',
    'fechaEmision',
    'fechaVcto',
    'total',
    'abono',
    'saldo',
    'tiempoCredito',
    'estado',
  ];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  pagination = new Pagination()


  dataSearch = {
    checkBoxFecha: true,
    codEstado: null,
    codEstab: null as (string | null),
    fechaInicio: formatDateToString(new Date()),
    fechaFin: formatDateToString(new Date()),
    idCliente: 0,
    ckCxcVencida: false,
    idTipoDocumento: 0
  }
  establecimientos: GroupedEstab[] = [];
  estadosDoc: any[] = [];
  tiposDoc: any[] = []

  getCodigoTipoDoc() {
    let dataDoc = this.tiposDoc.find(doc => doc.idTipoDocumento === this.dataSearch.idTipoDocumento);
    let codigo;
    if (dataDoc) {
      if (dataDoc.codigo === DOC_TYPE.FV) codigo = DOC_TYPE_SRI.F;
      if (dataDoc.codigo === DOC_TYPE.NE) codigo = DOC_TYPE.NE
    }
    return codigo;
  }

  getCuentasPorCobrar() {
    try {

      let params = {
        codEstab: this.dataSearch.codEstab,
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        ckFecha: this.dataSearch.checkBoxFecha,
        fechaInicio: this.dataSearch.fechaInicio,
        fechaFin: this.dataSearch.fechaFin,
        codEstado: isValidField(this.dataSearch.codEstado),
        idCliente: isValidField(this.dataSearch.idCliente),
        codDoc: isValidField(this.getCodigoTipoDoc()),
        ckCxcVencida: isValidField(this.dataSearch.ckCxcVencida)
      }

      this.selection = new SelectionModel<any>(true, []);
      this._cuentaPorCobrarUseCase.getAll(params).subscribe(response=>{
        this.dataSource = new MatTableDataSource(response.data);
      })
    } catch (error) {
      console.log(error)
    }
  }

  getDataFilter() {
    try {
      this._cuentaPorCobrarUseCase.getDataFilter().subscribe(  (response) => {
          this.establecimientos = response.estabs;
          this.estadosDoc = response.estadosDoc;
          this.tiposDoc = response.tiposDoc;

          if (this.estadosDoc.length > 0) {
            let dataEstado = this.estadosDoc.find(e => e.codigo === "NCBR");
            this.dataSearch.codEstado = dataEstado.codigo;
          }

          if (this.establecimientos.length > 0) {
            let dataEstab = this.establecimientos.find(estab => estab.defaultEstab);
            this.dataSearch.codEstab = dataEstab?.codEstab ?? null;
            this.getCuentasPorCobrar();
          }
      })
    } catch (error) {
      console.log(error)
    }
  }

  ngOnInit() {
    this.getDataFilter()
  }

  onDateRangeSelection(range: { from: string, to: string }) {
    this.dataSearch.fechaInicio = range.from;
    this.dataSearch.fechaFin = range.to;
    this.getCuentasPorCobrar()
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  }

  // Función para verificar si los valores de razonSocialComprador son los mismos
  verificarClienteIgual(selectedDocumentos: any[]) {
    const firstCustomerId = selectedDocumentos[0].idCliente;

    // Verificar si todas las demás entradas tienen la misma idCliente
    const sonIguales = selectedDocumentos.every(cuenta => cuenta.idCliente === firstCustomerId);

    return sonIguales;
  }

  openDocPaymentModal() {
    let selectedDocumentos = this.selection.selected

    if (selectedDocumentos.length === 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione al menos un documento!'
      });
      return
    }

    if (!this.verificarClienteIgual(selectedDocumentos)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione documentos que pertenezca al mismo cliente'
      });
      return
    }

    // Crear un array de promesas para cada solicitud
    const promises = selectedDocumentos.map(cxc => this._cuentaPorCobrarUseCase.getCuotasById(cxc.idCuentaPorCobrar));

    // Utilizar Promise.all para ejecutar las promesas concurrentemente

    forkJoin(promises).subscribe( (results) => {

        let mergeWithCuotas = this.mergeCuotas(selectedDocumentos, results);
        this.openModalCobroLote(mergeWithCuotas);

    })

  }


  mergeCuotas(selectedDocumentos: any[], results: any[]) {
    return selectedDocumentos.map(cxc => {
      const [cuotasFiltradas] = results.filter(item =>
        item.some((cuota: any) => cuota.idCuentaPorCobrar === cxc.idCuentaPorCobrar)
      )
      return {
        ...cxc,
        saldoTemporal: cxc.saldo,
        cuotas: structuredClone(cuotasFiltradas),
        cuotasOriginal: structuredClone(cuotasFiltradas)
      };
    });
  }

  openModalCobroLote(selectedDocumentos: any[]) {
    try {
      let params = {
        selectedDocumentos
      }
      this.comprobanteIngresoOpenModalSvc.open(params).then(result=>{
        if(result!==null && typeof result==='object'){
          this.getCuentasPorCobrar();
        }
      })
    } catch (error) {
      console.log(error)
    }
  }




}
