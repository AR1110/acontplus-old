import { Component, inject, model, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PageEvent } from '@angular/material/paginator';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FacturaFisicaService } from '../factura-fisica.service';
import { ToasterService } from '@core/services/toaster.service';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPagination } from '@shared/models/pagination.model';
import { formatDateToString } from '@core/utils/date.util';
import { getValidId } from '@core/utils/utils';
import { finalize, switchMap, throwError } from 'rxjs';
import { FacturaFisicaLista } from '../factura-fisica.interface';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { FacturaFisicaDetalleDirective } from '../factura-fisica-detalle.directive';
import { DialogService } from '@core/services/dialog.service';
import { FacturaFisicaAddEditModalComponent } from '../components/factura-fisica-add-edit-modal/factura-fisica-add-edit-modal.component';

@Component({
  selector: 'app-factura-fisica-page',
  standalone: true,
  imports: [
    //modules
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,

    //components
    BreadcrumbComponent,
    CustomTableContainerComponent,
    MatDynamicTableComponent,
    DateRangeSelectionComponent,

    //Directives
     FacturaFisicaDetalleDirective
  ],
  templateUrl: './factura-fisica-page.component.html',
  styles: ``
})
export class FacturaFisicaPageComponent {

  private facturaFisicaSvc = inject(FacturaFisicaService)
  private tS = inject(ToasterService)
  private dialogSvc = inject(DialogService)

  estabs: GroupedEstab[] = [];
  puntosEmision: GroupedEstabPuntoEmision[] = [];
  estadosDoc = [] as any[]
  isSearchAdvanced = signal(false)
  isLoadingResults = signal(false)


  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'serieComprobante', label: 'Serie', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'fechaVencimiento', label: 'Fecha Vcto', type: 'string' },
    { key: 'nombreComprador', label: 'Cliente', type: 'string' },
    { key: 'total', label: 'Total', type: 'number' },
    { key: 'abono', label: 'Abono', type: 'number' },
    { key: 'saldo', label: 'Saldo', type: 'number' },
    { key: 'nombreEstado', label: 'Estado', type: 'string' },
    { key: 'nombreUsuario', label: 'Usuario', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  dataSource = new MatTableDataSource<FacturaFisicaLista>();

  pagination = signal(new MatPagination());

  dataSearch = model({
    codEstab: null as string | null | undefined,
    idPuntoEmision: 0,
    checkBoxDate: false,
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


  private successResponseNotaEntregaAll(response: any) {

    this.dataSource = new MatTableDataSource(response.data);
    this.pagination.update((p) => ({
      ...p,
      totalRecords: response.totalRecords,
    }));

  }

  private getNotasEntrega() {
    if (this.isLoadingResults()) return; // Prevenir múltiples llamadas

    this.isLoadingResults.set(true)
    this.facturaFisicaSvc
      .getAll(this.getDataParams())
      .pipe(
        finalize(() => {
          this.isLoadingResults.set(false);
        }),
      )
      .subscribe((response) => {
        this.successResponseNotaEntregaAll(response);
      });
  }

  refresh() {
    this.getNotasEntrega()
  }

  ngOnInit(): void {
    this.isLoadingResults.set(true)
    this.facturaFisicaSvc.getDataFilter().pipe(
      switchMap((initialData:any) => {

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

        return this.facturaFisicaSvc.getAll(this.getDataParams())

      })
    )
      .pipe(
        finalize(() => this.isLoadingResults.set(false))
      )
      .subscribe(response => {
        this.successResponseNotaEntregaAll(response);
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

  openModalAddEdit(row?: FacturaFisicaLista){
    let dialogSvc = this.dialogSvc.open(FacturaFisicaAddEditModalComponent, {
      size: 'xl'
    })
    dialogSvc.subscribe(result=>{

    })


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
}
