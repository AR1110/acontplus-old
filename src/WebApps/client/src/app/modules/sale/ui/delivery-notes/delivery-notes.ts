import { Component, inject, model, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { NotificationService } from '@acontplus/ng-notifications';
import { formatDateToString } from '@core/utils/date.util';
import { getValidId } from '@core/utils/utils';
import { NotaEntregaDetalleDialogDirective } from '@sale/ui/directives/nota-entrega-detalle-dialog.directive';
import { NotaEntregaService } from '@sale/data/services/nota-entrega.service';
import {
  Pagination,
  DynamicCard,
  DataGrid,
  Button,
  DataGridColumn,
} from '@acontplus/ng-components';
import { finalize, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-delivery-notes',
  imports: [
    DynamicCard,
    DataGrid,
    Button,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    //components
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    //Directives
    NotaEntregaDetalleDialogDirective,
  ],
  templateUrl: './delivery-notes.html',
  styles: ``,
})
export class DeliveryNotes implements OnInit {
  private notaEntregaSvc = inject(NotaEntregaService);
  private tS = inject(NotificationService);

  estabs: GroupedEstab[] = [];
  puntosEmision: GroupedEstabPuntoEmision[] = [];
  estadosDoc = [] as any[];
  isSearchAdvanced = signal(false);
  isLoadingResults = signal(false);

  columns: DataGridColumn[] = [
    { header: 'Op.', field: 'op', sortable: false },
    { header: 'Serie', field: 'serieComprobante', sortable: true },
    { header: 'Fecha Emisión', field: 'fechaEmision', sortable: true },
    { header: 'Fecha Vcto', field: 'fechaVencimiento', sortable: true },
    { header: 'Cliente', field: 'razonSocialComprador', sortable: true },
    { header: 'Total', field: 'total', sortable: true, type: 'number' },
    { header: 'Abono', field: 'abono', sortable: true, type: 'number' },
    { header: 'Saldo', field: 'saldo', sortable: true, type: 'number' },
    { header: 'Estado', field: 'estadoNom', sortable: true },
    { header: 'Usuario', field: 'usuario', sortable: true },
  ];

  dataSource = new MatTableDataSource<any>();

  pagination = signal(new Pagination());

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
    esBuscarCliente: false,
  });

  private getDataParams() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,

      codEstab: this.dataSearch().codEstab,
      idPuntoEmision: getValidId(this.dataSearch().idPuntoEmision),
      byCliente: this.dataSearch().idCliente,
      checkBoxFecha: this.dataSearch().checkBoxDate,
      byUsuario: getValidId(this.dataSearch().idUsuario),
      idEstadoPago: getValidId(this.dataSearch().idEstadoDoc),
      fechaInicio: this.dataSearch().fromDate,
      fechaFin: this.dataSearch().toDate,
      //     nroSecuencial: fS.validAndFormatedRangeSequential(this.dataSearch.nroSecuencial),
      //    infoAdicional: this.dataSearch.infoAdicional ? this.dataSearch.infoAdicional : null,
      convertToDoc: this.dataSearch().isTransferredToDoc,
    };
    return params;
  }

  private successResponseNotaEntregaAll(response: any) {
    this.dataSource = new MatTableDataSource(response.data);
    this.pagination.update((p) => new Pagination(p.pageIndex, p.pageSize, response.totalRecords));
  }

  private getNotasEntrega() {
    if (this.isLoadingResults()) return; // Prevenir múltiples llamadas

    this.isLoadingResults.set(true);
    this.notaEntregaSvc
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
    this.getNotasEntrega();
  }

  ngOnInit(): void {
    this.isLoadingResults.set(true);
    this.notaEntregaSvc
      .getDataFilter()
      .pipe(
        switchMap((initialData) => {
          this.estabs = initialData.estabs;
          this.estadosDoc = initialData.estadosDoc;

          if (this.estabs.length > 0) {
            const dataEstab = this.estabs.find((estab) => estab.defaultEstab);
            this.puntosEmision = dataEstab?.puntosEmision || [];

            this.dataSearch.update((e) => {
              return {
                ...e,
                codEstab: dataEstab?.codEstab,
                idPuntoEmision:
                  this.puntosEmision.find((pto) => pto.defaultPtoEmi)?.idPuntoEmision || 0,
              };
            });
          } else {
            this.tS.warning({ message: 'No tienes asignado Establecimiento!' });
            return throwError(() => new Error('No tienes asignado Establecimiento'));
          }

          return this.notaEntregaSvc.getAll(this.getDataParams());
        }),
      )
      .pipe(finalize(() => this.isLoadingResults.set(false)))
      .subscribe((response) => {
        this.successResponseNotaEntregaAll(response);
      });
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

  onEstabChange() {
    const dataEstab = this.estabs.find((estab) => estab.codEstab === this.dataSearch().codEstab);
    this.puntosEmision = dataEstab?.puntosEmision || [];

    if (this.puntosEmision.length > 0) {
      this.setDataSearch(
        'idPuntoEmision',
        this.puntosEmision.find((pto) => pto.defaultPtoEmi)?.idPuntoEmision || 0,
      );
      this.refresh();
    } else {
      this.tS.warning({ message: 'No tiene puntos de emisión asignados' });
    }
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.update((e) => {
      return {
        ...e,
        fromDate: range.from,
        toDate: range.to,
      };
    });
    this.refresh();
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }
}
