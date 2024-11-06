import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {  MatMenuModule } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { DialogService } from '@core/services/dialog.service';
import { ToasterService } from '@core/services/toaster.service';
import { formatDateToString } from '@core/utils/date.util';
import { getValidId } from '@core/utils/utils';
import { CuentaPorPagarLista } from '@modules/accounting/cuenta-por-pagar/cuenta-por-pagar.interface';
import { CuentaPorPagarService } from '@modules/accounting/cuenta-por-pagar/cuenta-por-pagar.service';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { finalize, switchMap, throwError } from 'rxjs';
import { CuentaPorPagarCuotaModalComponent } from '../cuenta-por-pagar-cuota-modal/cuenta-por-pagar-cuota-modal.component';
import { MODAL_SIZE } from '@core/constants/global.constants';

@Component({
  selector: 'app-cuenta-por-pagar-lista',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    CustomTableContainerComponent,
    MatDynamicTableComponent,
    DateRangeSelectionComponent
  ],
  templateUrl: './cuenta-por-pagar-lista.component.html',
  styles: ``
})
export class CuentaPorPagarListaComponent {
  private cpcSvc = inject(CuentaPorPagarService)
  private tS = inject(ToasterService)
  private dialogSvc = inject(DialogService)

  estabs: GroupedEstab[] = [];
  puntosEmision: GroupedEstabPuntoEmision[] = [];
  estadosDoc = [] as any[]
  isSearchAdvanced = signal(false)
  isLoadingResults = signal(false)


  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'nombreDoc', label: 'Doc.', type: 'string' },
    { key: 'serieComprobante', label: 'Serie Doc.', type: 'string' },
    { key: 'identificacionComprador', label: 'Identificación', type: 'string' },
    { key: 'nombreComprador', label: 'Proveedor', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'fechaVencimiento', label: 'Fecha Vcto', type: 'string' },
    { key: 'total', label: 'Total', type: 'number' },
    { key: 'abono', label: 'Abono', type: 'number' },
    { key: 'saldo', label: 'Saldo', type: 'number' },
    { key: 'nombreEstado', label: 'Estado', type: 'string' },
    { key: 'usuario', label: 'Usuario', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  dataSource = new MatTableDataSource<CuentaPorPagarLista>();

  pagination = signal(new MatPagination());

  dataSearch = model({
    codEstab: null as string | null | undefined,
    idPuntoEmision: 0,
    checkBoxDate: true,
    idCliente: 0,
    idUsuario: 0,
    idEstadoDoc: 0,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    isTransferredToDoc: false,
    esDatoAdicional: false,
    esBuscarPorNro: false,
    esBuscarUsuario: false,
    esBuscarCliente: false
  })

  private getDataParams() {
    let params = {

      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,

        codEstab: this.dataSearch().codEstab,
        idPuntoEmision: getValidId(this.dataSearch().idPuntoEmision),
        byCliente: this.dataSearch().idCliente,
        checkBoxFecha: this.dataSearch().checkBoxDate,
        byUsuario: getValidId(this.dataSearch().idUsuario),
        idEstadoPago: getValidId(this.dataSearch().idEstadoDoc),
        fechaInicio:  this.dataSearch().fromDate,
        fechaFin: this.dataSearch().toDate,
   //     nroSecuencial: fS.validAndFormatedRangeSequential(this.dataSearch.nroSecuencial),
    //    infoAdicional: this.dataSearch.infoAdicional ? this.dataSearch.infoAdicional : null,
        convertToDoc: this.dataSearch().isTransferredToDoc


    };
    return params;
  }


  private setResponseGetAll(response: any) {

    this.dataSource = new MatTableDataSource(response.data);
    this.pagination.update((p) => ({
      ...p,
      totalRecords: response.totalRecords,
    }));

  }

  private getAll() {
    if (this.isLoadingResults()) return; // Prevenir múltiples llamadas

    this.isLoadingResults.set(true)
    this.cpcSvc
      .getAll(this.getDataParams())
      .pipe(
        finalize(() => {
          this.isLoadingResults.set(false);
        }),
      )
      .subscribe((response) => {
        this.setResponseGetAll(response);
      });
  }

  refresh() {
    this.getAll()
  }

  ngOnInit(): void {
    this.isLoadingResults.set(true)
    this.cpcSvc.getDataFilter().pipe(
      switchMap(initialData => {
        console.log(initialData)
        this.estabs = initialData.estabs;
        this.estadosDoc = initialData.estadosDoc;

        if (this.estabs.length > 0) {
          let dataEstab = this.estabs.find(estab => (estab.defaultEstab));
          this.puntosEmision = dataEstab?.puntosEmision || [];

          this.dataSearch.update(e => {
            return {
              ...e,
              codEstab: dataEstab?.codEstab,
              idPuntoEmision: this.puntosEmision.find(pto => (pto.defaultPtoEmi))?.idPuntoEmision || 0
            }

          })
        } else {
          this.tS.toastr({
            type: 'warning',
            message: 'No tienes asignado Establecimiento!'
          })
          return throwError(() => new Error('No tienes asignado Establecimiento'));
         }

         return this.cpcSvc.getAll(this.getDataParams())

      })
    )
      .pipe(
        finalize(() => this.isLoadingResults.set(false))
      )
      .subscribe(response => {
        this.setResponseGetAll(response);
      })


  }

  setDataSearch<K extends keyof ReturnType<typeof this.dataSearch>>(
    key: K,
    value: ReturnType<typeof this.dataSearch>[K],
  ) {
    this.dataSearch.update((ds) => {
      return {
        ...ds,
        [key]: value,
      };
    });
  }

  onEstabChange(){
    let dataEstab = this.estabs.find(estab => estab.codEstab === this.dataSearch().codEstab);
    this.puntosEmision = dataEstab?.puntosEmision || [];

    if (this.puntosEmision.length > 0) {
      this.setDataSearch("idPuntoEmision", this.puntosEmision.find(pto => (pto.defaultPtoEmi))?.idPuntoEmision || 0)
        this.refresh();
    } else {
        this.tS.toastr({
          type: 'warning',
          message: 'No tiene puntos de emisión asignados'
        })
    }
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.update(e => {
      return {
        ...e,
        fromDate: range.from,
        toDate: range.to
      }
    })
    this.refresh()
  }


  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.refresh();
  }


  openCuotaModal (item: CuentaPorPagarLista){

    let modalRef = this.dialogSvc.open(CuentaPorPagarCuotaModalComponent,
      {
        size: MODAL_SIZE.XL,
        data: {
          idCuentaPorPagar: item.idCuentaPorPagar
        }
      }
    )

    modalRef.subscribe(result=>{
      console.log(result)
    })

  }


}
